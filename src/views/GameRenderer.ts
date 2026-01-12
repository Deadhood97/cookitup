import { type GameState, type Tile, type LevelConfig } from '../engine/types';
import { AssetManager } from '../managers/AssetManager';
import { GameEngine } from '../engine/GameEngine';
import { ProgressManager } from '../managers/ProgressManager';

export class GameRenderer {
    private tileContainer: HTMLElement;
    private scoreEl: HTMLElement;
    private overlay: HTMLElement;
    private overlayMsg: HTMLElement;
    private buttonNext: HTMLElement;
    private recipeList: HTMLElement;
    private tileElements = new Map<string, HTMLDivElement>();
    private engine: GameEngine | null = null;
    private timerInterval: number | null = null;

    constructor() {
        this.tileContainer = document.getElementById('tile-container')!;
        this.scoreEl = document.getElementById('score')!;
        this.overlay = document.getElementById('overlay')!;
        this.overlayMsg = document.getElementById('overlay-msg')!;
        this.buttonNext = document.getElementById('next-level-btn')!;
        this.recipeList = document.getElementById('recipe-list')!;
    }

    public setEngine(engine: GameEngine) {
        this.engine = engine;
    }

    public clearTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    public startTimer(limit: number, onTimeUp: () => void) {
        this.clearTimer();
        let timeLeft = limit;
        const timerEl = document.getElementById('timer');

        if (timerEl) {
            timerEl.textContent = this.formatTime(timeLeft);
            // Reset classes
            timerEl.classList.remove('warning');

            this.timerInterval = window.setInterval(() => {
                timeLeft--;
                timerEl.textContent = this.formatTime(timeLeft);

                if (timeLeft <= 10) {
                    timerEl.classList.add('warning');
                }

                if (timeLeft <= 0) {
                    this.clearTimer();
                    onTimeUp();
                }
            }, 1000);
        }
    }

    private formatTime(seconds: number): string {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    }

    public render(state: GameState, engine: GameEngine) {
        // Cache elements if missing
        if (!document.body.contains(this.tileContainer)) {
            this.rebindElements();
        }

        // 1. Mark active tiles
        const activeIds = new Set<string>();

        state.grid.forEach((row, r) => {
            row.forEach((tile, c) => {
                if (tile) {
                    activeIds.add(tile.id);
                    let el = this.tileElements.get(tile.id);
                    if (!el) {
                        el = this.createTileElement(tile);
                        this.tileElements.set(tile.id, el);
                        this.tileContainer.appendChild(el);
                    }
                    this.updateTilePosition(el, tile, r, c);
                }
            });
        });

        // 2. Remove stale tiles
        this.tileElements.forEach((el, id) => {
            if (!activeIds.has(id)) {
                el.remove();
                this.tileElements.delete(id);
            }
        });

        // 3. Update Score & Info
        if (this.scoreEl) {
            this.scoreEl.textContent = `Score: ${state.score} | Moves: ${state.moves}`;
        }

        // 4. Update Undo Button State
        const undoBtn = document.getElementById('undo-btn');
        if (undoBtn) {
            if (engine.canUndo()) {
                undoBtn.removeAttribute('disabled');
                undoBtn.classList.remove('disabled');
            } else {
                undoBtn.setAttribute('disabled', 'true');
                undoBtn.classList.add('disabled');
            }
        }

        // 5. Update Next Tile Preview
        const nextTileEl = document.getElementById('next-tile-icon') as HTMLImageElement;
        if (nextTileEl && state.nextTile) {
            nextTileEl.src = AssetManager.getAsset(state.nextTile);
        }

        // 6. Handle Game Over / Win
        this.handleOverlay(state);
    }

    private rebindElements() {
        this.tileContainer = document.getElementById('tile-container')!;
        this.scoreEl = document.getElementById('score')!;
        this.overlay = document.getElementById('overlay')!;
        this.overlayMsg = document.getElementById('overlay-msg')!;
        this.buttonNext = document.getElementById('next-level-btn')!;
        this.recipeList = document.getElementById('recipe-list')!;
        this.tileElements.clear(); // Clear cache if DOM was wiped
    }

    private handleOverlay(state: GameState) {
        if (state.status !== 'playing') {
            this.clearTimer();
            if (this.overlay) this.overlay.classList.remove('hidden');

            if (state.status === 'won') {
                const config = this.engine?.getConfig();
                if (config) {
                    const stars = this.calculateStars(state.moves, config.starThresholds);
                    this.overlayMsg.textContent = `Level Complete! ${stars} Stars!`;
                    // Save Progress
                    const progress = ProgressManager.load();
                    ProgressManager.completeLevel(progress, config.id, stars, config.nextLevelId);
                }
                if (this.buttonNext) this.buttonNext.classList.remove('hidden');
            } else {
                this.overlayMsg.textContent = state.status === 'lost' ? "Game Over" : "Time's Up!";
                if (this.buttonNext) this.buttonNext.classList.add('hidden');
            }
        } else {
            if (this.overlay) this.overlay.classList.add('hidden');
        }
    }

    private calculateStars(moves: number, thresholds: { 1: number, 2: number, 3: number }): number {
        if (moves <= thresholds[3]) return 3;
        if (moves <= thresholds[2]) return 2;
        return 1;
    }

    private createTileElement(tile: Tile): HTMLDivElement {
        const el = document.createElement('div');
        el.dataset.id = tile.id;
        return el;
    }

    private updateTilePosition(el: HTMLDivElement, tile: Tile, row: number, col: number) {
        el.className = `tile ${tile.type} ${tile.state}`;
        if (tile.level > 1) el.classList.add(`level-${tile.level}`);

        // Update Content if changed (e.g. transformation)
        const currentName = el.dataset.name;
        if (currentName !== tile.name) {
            el.innerHTML = '';
            const img = document.createElement('img');
            img.src = AssetManager.getAsset(tile.name);
            img.draggable = false;
            el.appendChild(img);

            if (tile.type === 'ingredient' && tile.level > 1) {
                this.addLevelBadge(el, tile.level);
            }
        }

        // Ensure badge exists for leveled items
        if (tile.type === 'ingredient' && tile.level > 1 && !el.querySelector('.level-badge')) {
            this.addLevelBadge(el, tile.level);
        }

        el.dataset.name = tile.name;

        // RESPONSIVE POSITIONING
        // We use percentages relative to the container size
        // Grid is 4x4. Gap is small context.
        // Let's assume standard CSS Grid logic, but we position absolutely.
        // Container is square.
        // Cell size = (100% - 5 * gap) / 4

        // Actually, let's keep it simple and consistent with CSS variables if possible
        // But since we are inside a JS class, let's use % to match the container.
        // Gap = 10px, Size = 80px -> Total 370px approx.
        // 80/370 ~= 21.6%. 10/370 ~= 2.7%.
        // Let's stick to pixel math relative to offsets for now OR rely on CSS definition?
        // Current CSS uses pixels. Expert critique asked for responsive.
        // To be truly responsive, we should calculate based on container clientWidth.

        const containerWidth = this.tileContainer.clientWidth || 370; // Fallback
        const gap = 10; // fixed gap for now, or read from CSS?
        // Let's deduce cell size
        const cellSize = (containerWidth - 5 * gap) / 4;

        const top = gap + row * (cellSize + gap);
        const left = gap + col * (cellSize + gap);

        el.style.width = `${cellSize}px`;
        el.style.height = `${cellSize}px`;
        el.style.transform = `translate(${left}px, ${top}px)`;
    }

    private addLevelBadge(el: HTMLElement, level: number) {
        const badge = document.createElement('div');
        badge.className = 'level-badge';
        badge.textContent = `x${level}`;
        el.appendChild(badge);
    }

    public renderRecipes(config: LevelConfig) {
        if (!this.recipeList) return;
        const reactions = config.reactions;
        const uniqueReactions: any[] = [];
        const seen = new Set();

        for (const r of reactions) {
            const key = [r.inputA, r.inputB].sort().join('+');
            if (!seen.has(key)) {
                seen.add(key);
                uniqueReactions.push(r);
            }
        }

        this.recipeList.innerHTML = uniqueReactions.map(r => {
            const outputName = r.output === null ? 'Clean' : r.output;
            const outputImg = AssetManager.getAsset(outputName);

            return `
            <div class="recipe-item">
                <div class="combine">
                    <img src="${AssetManager.getAsset(r.inputA)}" class="icon-small" title="${r.inputA}">
                    <span>+</span>
                    <img src="${AssetManager.getAsset(r.inputB)}" class="icon-small" title="${r.inputB}">
                </div>
                <span>=</span>
                <img src="${outputImg}" class="icon-medium" title="${outputName}">
                <span class="recipe-name">${outputName}</span>
            </div>
        `}).join('') + `
            <div class="tip-box">
                <p><strong>Goal:</strong> ${config.description}</p>
            </div>
        `;
    }

    public showFloatingText(text: string, type: 'burnt' | 'soggy' | 'cooked' | 'merge') {
        const el = document.createElement('div');
        el.className = `floating-text ${type}`;
        el.textContent = text;

        // Randomize position slightly around center or top
        el.style.left = '50%';
        el.style.top = '40%';

        document.body.appendChild(el);

        // Remove after animation
        setTimeout(() => el.remove(), 1000);
    }
}
