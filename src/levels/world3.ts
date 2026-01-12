import { type LevelConfig } from '../engine/types';
import { ITEMS, STATES } from '../engine/constants';

// Reusing BASIC_REACTIONS for base mechanics (Dough etc if needed, but we focus on Sushi)

/*
    SUSHI CHAIN:
    1. Rice (Flour) + Water -> Cooked Rice (Dough)
    2. Nori (Burnt Goop) + Cooked Rice (Dough) -> Sushi Base (Crust)
    3. Sushi Base (Crust) + Fish (Meat) -> Sushi (Cake)
*/

const SUSHI_REACTIONS = [
    // Cooked Rice
    { inputA: ITEMS.RICE, inputB: ITEMS.WATER, output: 'Cooked_Rice', outputState: STATES.COOKED },
    { inputA: ITEMS.WATER, inputB: ITEMS.RICE, output: 'Cooked_Rice', outputState: STATES.COOKED },

    // Sushi Base
    { inputA: ITEMS.NORI, inputB: 'Cooked_Rice', output: 'Sushi_Base', outputState: STATES.RAW },
    { inputA: 'Cooked_Rice', inputB: ITEMS.NORI, output: 'Sushi_Base', outputState: STATES.RAW },

    // Sushi
    { inputA: 'Sushi_Base', inputB: ITEMS.SASHIMI, output: ITEMS.SUSHI, outputState: STATES.RAW },
    { inputA: ITEMS.SASHIMI, inputB: 'Sushi_Base', output: ITEMS.SUSHI, outputState: STATES.RAW },

    // Knife Interactions (Tool)
    // Fish + Knife -> Sashimi
    { inputA: ITEMS.FISH, inputB: ITEMS.KNIFE, output: ITEMS.SASHIMI, outputState: STATES.RAW },
    { inputA: ITEMS.KNIFE, inputB: ITEMS.FISH, output: ITEMS.SASHIMI, outputState: STATES.RAW },
];

const COMMON_TILE_PROPS = {
    [ITEMS.RICE]: { type: 'ingredient' },
    [ITEMS.WATER]: { type: 'element' },
    [ITEMS.NORI]: { type: 'ingredient' },
    [ITEMS.FISH]: { type: 'ingredient' },
    'Cooked_Rice': { type: 'ingredient' },
    'Sushi_Base': { type: 'ingredient' },
    [ITEMS.SASHIMI]: { type: 'ingredient' },
    [ITEMS.SUSHI]: { type: 'result' },
    [ITEMS.KNIFE]: { type: 'tool', isStatic: true }, // Static Obstacle
} as const;


// Level 7: Rice Fields
export const Level7_RiceFields: LevelConfig = {
    id: 'sushi_1',
    worldId: 3,
    nextLevelId: 'sushi_2',
    starThresholds: { 1: 100, 2: 70, 3: 40 },
    name: '7. Rice Fields',
    description: 'Harvest Rice. Lots of it.',
    theme: 'sushi',
    reactions: SUSHI_REACTIONS,
    tileProps: COMMON_TILE_PROPS as any, // Cast to avoid strict type checks on temp props
    spawns: {
        [ITEMS.RICE]: 0.7, // High Spawn Rate
        [ITEMS.WATER]: 0.3
    },
    winCondition: (state) => state.grid.flat().filter(t => t?.name === 'Cooked_Rice').length >= 3
};

// Level 8: The Knife (Obstacle Introduction)
export const Level8_TheKnife: LevelConfig = {
    id: 'sushi_2',
    worldId: 3,
    nextLevelId: 'sushi_3',
    starThresholds: { 1: 120, 2: 90, 3: 60 },
    name: '8. The Knife',
    description: 'Use the Knife to cut Fish into Sashimi.',
    theme: 'sushi',
    reactions: SUSHI_REACTIONS,
    tileProps: COMMON_TILE_PROPS as any,
    spawns: {
        [ITEMS.RICE]: 0.3,
        [ITEMS.WATER]: 0.2,
        [ITEMS.NORI]: 0.2,
        [ITEMS.FISH]: 0.3 // Added Fish so level is possible!
    },
    // Floating Knife in the middle
    layout: [
        { position: [1, 1], item: ITEMS.KNIFE, isStatic: true },
        { position: [2, 2], item: ITEMS.KNIFE, isStatic: true }
    ],
    winCondition: (state) => state.grid.flat().some(t => t?.name === ITEMS.SASHIMI)
};

// Level 9: Sushi Master
export const Level9_SushiMaster: LevelConfig = {
    id: 'sushi_3',
    worldId: 3,
    nextLevelId: 'indian_1', // Link to World 4
    starThresholds: { 1: 200, 2: 150, 3: 100 },
    name: '9. Sushi Master',
    description: 'Combine everything!',
    theme: 'sushi',
    reactions: SUSHI_REACTIONS,
    tileProps: COMMON_TILE_PROPS as any,
    spawns: {
        [ITEMS.RICE]: 0.3,
        [ITEMS.WATER]: 0.2,
        [ITEMS.NORI]: 0.3,
        [ITEMS.FISH]: 0.2
    },
    layout: [
        { position: [1, 2], item: ITEMS.KNIFE, isStatic: true }
    ],
    winCondition: (state) => state.grid.flat().some(t => t?.name === ITEMS.SUSHI)
};
