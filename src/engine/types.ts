export type TileType = 'ingredient' | 'element' | 'blocker' | 'result';
export type TileState = 'raw' | 'cooked' | 'burnt' | 'soggy';

export interface Tile {
  id: string; // Unique ID for DOM diffing
  type: TileType;
  name: string; // "Dough", "Fire"
  state: TileState;
  level: number; // 1-4, affects stacking
  cooldown?: number; // For stationary interactions
  isStatic?: boolean; // If true, cannot be moved
}

export type Grid = (Tile | null)[][];

export interface Position {
  row: number;
  col: number;
}

export interface Reaction {
  inputA: string; // Name of item A
  inputB: string; // Name of item B (or element)
  output: string | null; // Resulting item name, or null to destroy both
  outputState: TileState;
}

export interface Recipe {
  id: string;
  name: string; // e.g. "Bread"
  requirements: { name: string; state: TileState; count: number }[];
}

export interface GameState {
  grid: Grid;
  score: number;
  moves: number;
  activeOrders: Recipe[];
  status: 'playing' | 'won' | 'lost';
  nextTile: string; // Preview of next spawn
}

export type GameEventListener = (event: string, data: any) => void;

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface LevelConfig {
  id: string; // Unique ID e.g. 'world1_1'
  worldId: number; // 1, 2, 3, 4
  nextLevelId: string | null; // ID of the next level, or null if end of world/game
  starThresholds: { 1: number; 2: number; 3: number }; // Max moves for 1, 2, 3 stars (or maybe score?)
  // Let's use Moves for now as per design doc. Lower is better.
  // Actually design doc said "Completed within X moves".

  name: string;
  description: string;
  reactions: Reaction[];
  // Defines what can spawn and their weights (0-1)
  spawns: Record<string, number>;
  // Optional specific overrides per difficulty
  difficultySpawns?: {
    easy: Record<string, number>;
    medium: Record<string, number>;
    hard: Record<string, number>;
  };
  // Types mapping for rendering/logic
  tileProps: Record<string, { type: TileType; isStatic?: boolean }>;

  // Initial fixed tiles
  layout?: { position: [number, number], item: string, isStatic?: boolean }[];

  // Visual Theme
  theme?: 'bakery' | 'pizzeria' | 'sushi' | 'indian' | 'default';

  // Optional Time Limit in Seconds
  timeLimit?: number;

  // Function to check victory specific to this level
  winCondition: (state: GameState) => boolean;
}
