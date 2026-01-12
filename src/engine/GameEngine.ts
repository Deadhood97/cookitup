import { type GameState, type Tile, type Position, type Reaction, type LevelConfig, type Difficulty } from './types';
import { SCORES } from './constants';

export class GameEngine {
    private state: GameState;
    private readonly gridSize = 4;
    private config: LevelConfig;
    private tileIdCounter = 0;
    private difficulty: Difficulty;

    private listeners: Record<string, Function[]> = {};
    private history: string[] = [];
    private readonly MAX_HISTORY = 5;

    constructor(config: LevelConfig, difficulty: Difficulty = 'medium') {
        this.config = config;
        this.difficulty = difficulty;
        this.state = this.getInitialState();
        // Generate first nextTile immediately
        this.state.nextTile = this.pickNextTile();
    }

    public on(event: string, callback: Function) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }

    private emit(event: string, data: any) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(cb => cb(data));
        }
    }

    private getInitialState(): GameState {
        return {
            grid: Array(this.gridSize).fill(null).map(() => Array(this.gridSize).fill(null)),
            score: 0,
            moves: 0,
            activeOrders: [],
            status: 'playing',
            nextTile: '', // Will be set in constructor
        };
    }

    public getState(): GameState {
        return this.state;
    }

    public getConfig(): LevelConfig {
        return this.config;
    }

    public canUndo(): boolean {
        return this.history.length > 0 && this.state.status === 'playing';
    }

    public undo() {
        if (!this.canUndo()) return;

        const previousJson = this.history.pop();
        if (previousJson) {
            this.state = JSON.parse(previousJson);
        }
    }

    private pushHistory(snapshot: string) {
        if (this.history.length >= this.MAX_HISTORY) {
            this.history.shift(); // Remove oldest
        }
        this.history.push(snapshot);
    }

    public initialize() {
        this.state = this.getInitialState();
        this.state.nextTile = this.pickNextTile();
        this.history = []; // Reset history

        // 1. Place Fixed Layout Tiles
        if (this.config.layout) {
            this.config.layout.forEach(item => {
                const tile = this.createTile(item.item, 'raw');
                if (item.isStatic) tile.isStatic = true;
                this.state.grid[item.position[0]][item.position[1]] = tile;
            });
        }

        // 2. Spawn initial random tiles
        this.spawnTile();
        this.spawnTile();
    }

    public restart() {
        this.initialize();
    }

    public move(direction: 'up' | 'down' | 'left' | 'right'): void {
        if (this.state.status !== 'playing') return;

        // Save state before move
        const stateSnapshot = JSON.stringify(this.state);

        let moved = false;
        const vector = this.getVector(direction);
        const traversals = this.buildTraversals(vector);

        traversals.x.forEach(x => {
            traversals.y.forEach(y => {
                const cell = { row: x, col: y };
                const tile = this.state.grid[x][y];

                // Skip if tile doesn't exist OR is static
                if (tile && !tile.isStatic) {
                    const positions = this.findFarthestPosition(cell, vector);
                    const next = this.getCellContent(positions.next);

                    if (next && this.canReact(tile, next)) {
                        // Reaction Logic
                        const reaction = this.getReaction(tile, next);
                        if (reaction) {
                            if (reaction.output === null) {
                                // Destruction
                                if (!next.isStatic) {
                                    this.state.grid[positions.next.row][positions.next.col] = null;
                                }
                                this.state.grid[x][y] = null;
                            } else {
                                // Check if target is a Static Tool
                                if (next.isStatic) {
                                    // TOOL REACTION: Transform the *moving* tile in place
                                    this.state.grid[x][y] = this.createTile(reaction.output, reaction.outputState);
                                    this.emit('reaction', { type: reaction.outputState, text: reaction.outputState });
                                } else {
                                    // STANDARD REACTION: Target becomes output, mover is consumed
                                    this.state.grid[positions.next.row][positions.next.col] = this.createTile(reaction.output, reaction.outputState);
                                    this.state.grid[x][y] = null;
                                    this.emit('reaction', { type: reaction.outputState, text: reaction.outputState });
                                }
                                this.state.score += SCORES.REACTION_BASE;
                            }
                            moved = true;
                        }
                    } else if (next && this.canMerge(tile, next)) {
                        // Merge Logic
                        const newLevel = next.level + 1;
                        if (newLevel <= 4) {
                            next.level = newLevel;
                            this.state.grid[x][y] = null;
                            this.state.score += SCORES.MERGE_BASE * newLevel;
                            moved = true;
                            this.emit('merge', { level: newLevel });
                        } else {
                            // Blocked 
                            this.moveTile(cell, positions.farthest);
                            if (cell.row !== positions.farthest.row || cell.col !== positions.farthest.col) moved = true;
                        }
                    } else {
                        // Move into empty 
                        this.moveTile(cell, positions.farthest);
                        if (cell.row !== positions.farthest.row || cell.col !== positions.farthest.col) moved = true;
                    }
                }
            });
        });

        if (moved) {
            // Commit to history only if move was valid
            this.pushHistory(stateSnapshot);

            this.spawnTile();
            this.state.moves++;
            this.checkWinCondition();
            if (this.state.status !== 'won') {
                this.checkLossCondition();
            }
        }
    }

    private checkWinCondition() {
        if (this.config.winCondition(this.state)) {
            this.state.status = 'won';
            this.state.score += SCORES.WIN_BONUS;
            this.emit('win', {});
        }
    }

    private checkLossCondition() {
        // If empty cells exist, no loss
        for (let r = 0; r < this.gridSize; r++) {
            for (let c = 0; c < this.gridSize; c++) {
                if (!this.state.grid[r][c]) return;
            }
        }

        // Check for possible moves/merges/reactions
        for (let r = 0; r < this.gridSize; r++) {
            for (let c = 0; c < this.gridSize; c++) {
                const tile = this.state.grid[r][c]!;

                // Check right
                if (c < this.gridSize - 1) {
                    const right = this.state.grid[r][c + 1]!;
                    if (this.canMerge(tile, right) || this.canReact(tile, right) || this.canReact(right, tile)) return;
                }

                // Check down
                if (r < this.gridSize - 1) {
                    const down = this.state.grid[r + 1][c]!;
                    if (this.canMerge(tile, down) || this.canReact(tile, down) || this.canReact(down, tile)) return;
                }
            }
        }

        this.state.status = 'lost';
        this.emit('loss', {});
    }

    // Helpers

    private getVector(direction: 'up' | 'down' | 'left' | 'right') {
        const map = {
            up: { x: -1, y: 0 },
            down: { x: 1, y: 0 },
            left: { x: 0, y: -1 },
            right: { x: 0, y: 1 },
        };
        return map[direction];
    }

    private buildTraversals(vector: { x: number, y: number }) {
        const x = [];
        const y = [];
        for (let i = 0; i < this.gridSize; i++) x.push(i);
        for (let i = 0; i < this.gridSize; i++) y.push(i);

        if (vector.x === 1) x.reverse();
        if (vector.y === 1) y.reverse();

        return { x, y };
    }

    private findFarthestPosition(cell: Position, vector: { x: number, y: number }) {
        let previous;
        let next = cell;
        do {
            previous = next;
            next = { row: previous.row + vector.x, col: previous.col + vector.y };
        } while (this.withinBounds(next) && this.cellAvailable(next));

        return {
            farthest: previous,
            next: next
        };
    }

    private withinBounds(position: Position) {
        return position.row >= 0 && position.row < this.gridSize &&
            position.col >= 0 && position.col < this.gridSize;
    }

    private cellAvailable(position: Position) {
        return !this.state.grid[position.row][position.col];
    }

    private getCellContent(position: Position) {
        if (this.withinBounds(position)) {
            return this.state.grid[position.row][position.col];
        }
        return null;
    }

    private canReact(incoming: Tile, target: Tile): boolean {
        return !!this.getReaction(incoming, target);
    }

    private getReaction(incoming: Tile, target: Tile): Reaction | undefined {
        return this.config.reactions.find(r =>
            r.inputA === incoming.name &&
            r.inputB === target.name &&
            // Config-based reactions are now the source of truth
            true
        );
    }

    private canMerge(incoming: Tile, target: Tile): boolean {
        return incoming.name === target.name &&
            incoming.state === target.state &&
            incoming.level === target.level &&
            incoming.level < 4;
    }

    private moveTile(from: Position, to: Position) {
        if (from.row === to.row && from.col === to.col) return;
        this.state.grid[to.row][to.col] = this.state.grid[from.row][from.col];
        this.state.grid[from.row][from.col] = null;
    }

    private createTile(name: string, state: string): Tile {
        const prop = this.config.tileProps[name] || { type: 'ingredient' };
        return {
            id: `tile-${this.tileIdCounter++}`,
            type: prop.type,
            name,
            state: state as any,
            level: 1,
            isStatic: prop.isStatic
        };
    }

    private pickNextTile(): string {
        const r = Math.random();
        let accumulated = 0;

        // Determine Spawns based on Difficulty
        let spawns = this.config.spawns;
        if (this.config.difficultySpawns && this.config.difficultySpawns[this.difficulty]) {
            spawns = this.config.difficultySpawns[this.difficulty];
        }

        // Default to first key if nothing matches (shouldn't happen if weights sum to 1)
        let type = Object.keys(spawns)[0];

        for (const [key, weight] of Object.entries(spawns)) {
            accumulated += weight;
            if (r <= accumulated) {
                type = key;
                break;
            }
        }
        return type;
    }

    private spawnTile(): void {
        const emptyCells: Position[] = [];
        for (let r = 0; r < this.gridSize; r++) {
            for (let c = 0; c < this.gridSize; c++) {
                if (!this.state.grid[r][c]) {
                    emptyCells.push({ row: r, col: c });
                }
            }
        }

        if (emptyCells.length > 0) {
            const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];

            // Use PRE-SELECTED next tile
            const type = this.state.nextTile;

            this.state.grid[row][col] = this.createTile(type, 'raw');

            // Pre-select NEXT tile for UI
            this.state.nextTile = this.pickNextTile();
        }
    }
}
