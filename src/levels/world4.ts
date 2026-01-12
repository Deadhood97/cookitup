import { type LevelConfig } from '../engine/types';
import { ITEMS, STATES } from '../engine/constants';

const INDIAN_REACTIONS = [
    // Grinder Logic (Tool)
    // Chili + Grinder -> Chili Powder (Grinder stays)
    // This relies on the engine's new "Static Tool" check.
    { inputA: ITEMS.CHILI, inputB: ITEMS.GRINDER, output: ITEMS.CHILI_POWDER, outputState: STATES.RAW },
    { inputA: ITEMS.TURMERIC, inputB: ITEMS.GRINDER, output: ITEMS.TURMERIC_POWDER, outputState: STATES.RAW },

    // Cooking Curry
    // Onion (using Tomato placeholder logic for now or generic)
    // Let's simplify: Tomato + Chili Powder -> Curry Base
    { inputA: ITEMS.TOMATO, inputB: ITEMS.CHILI_POWDER, output: ITEMS.CURRY_BASE, outputState: STATES.RAW },
    { inputA: ITEMS.CHILI_POWDER, inputB: ITEMS.TOMATO, output: ITEMS.CURRY_BASE, outputState: STATES.RAW },

    // Butter Chicken: Curry Base + Chicken + Fire
    { inputA: ITEMS.CURRY_BASE, inputB: ITEMS.CHICKEN, output: 'Raw_Butter_Chicken', outputState: STATES.RAW },
    { inputA: ITEMS.CHICKEN, inputB: ITEMS.CURRY_BASE, output: 'Raw_Butter_Chicken', outputState: STATES.RAW },

    { inputA: 'Raw_Butter_Chicken', inputB: ITEMS.FIRE, output: ITEMS.BUTTER_CHICKEN, outputState: STATES.COOKED },
    { inputA: ITEMS.FIRE, inputB: 'Raw_Butter_Chicken', output: ITEMS.BUTTER_CHICKEN, outputState: STATES.COOKED },

    // TRAPS: Don't cook raw protein directly
    { inputA: ITEMS.PANEER, inputB: ITEMS.FIRE, output: ITEMS.BURNT_GOOP, outputState: STATES.BURNT },
    { inputA: ITEMS.FIRE, inputB: ITEMS.PANEER, output: ITEMS.BURNT_GOOP, outputState: STATES.BURNT },
    { inputA: ITEMS.CHICKEN, inputB: ITEMS.FIRE, output: ITEMS.BURNT_GOOP, outputState: STATES.BURNT },
    { inputA: ITEMS.FIRE, inputB: ITEMS.CHICKEN, output: ITEMS.BURNT_GOOP, outputState: STATES.BURNT },
];

const COMMON_TILE_PROPS = {
    [ITEMS.CHILI]: { type: 'ingredient' },
    [ITEMS.TURMERIC]: { type: 'ingredient' },
    [ITEMS.PANEER]: { type: 'ingredient' },
    [ITEMS.CHICKEN]: { type: 'ingredient' },
    [ITEMS.GRINDER]: { type: 'tool', isStatic: true },
    [ITEMS.CHILI_POWDER]: { type: 'ingredient' },
    [ITEMS.TURMERIC_POWDER]: { type: 'ingredient' },
    [ITEMS.CURRY_BASE]: { type: 'ingredient' },
    [ITEMS.BUTTER_CHICKEN]: { type: 'result' },

    [ITEMS.TOMATO]: { type: 'ingredient' }, // Reused
    [ITEMS.FIRE]: { type: 'element' }, // Reused
    'Raw_Butter_Chicken': { type: 'ingredient' },
    [ITEMS.BURNT_GOOP]: { type: 'blocker' },
} as const;

// Level 10: Spice Market
export const Level10_SpiceMarket: LevelConfig = {
    id: 'indian_1',
    worldId: 4,
    nextLevelId: 'indian_2',
    starThresholds: { 1: 80, 2: 50, 3: 30 },
    name: '10. Spice Market',
    description: 'Get familiar with the spices.',
    theme: 'indian',
    reactions: INDIAN_REACTIONS,
    tileProps: COMMON_TILE_PROPS as any,
    spawns: {
        [ITEMS.CHILI]: 0.4,
        [ITEMS.TURMERIC]: 0.4,
        [ITEMS.TOMATO]: 0.2
    },
    // Simple goal: Just make powders? No, start with simple merge.
    // Actually, let's skip to Grinder intro.
    layout: [
        { position: [1, 1], item: ITEMS.GRINDER, isStatic: true }
    ],
    winCondition: (state) => state.grid.flat().filter(t => t?.name === ITEMS.CHILI_POWDER).length >= 2
};

// Level 11: The Daily Grind
export const Level11_TheDailyGrind: LevelConfig = {
    id: 'indian_2',
    worldId: 4,
    nextLevelId: 'indian_3',
    starThresholds: { 1: 100, 2: 80, 3: 60 },
    name: '11. The Daily Grind',
    description: 'Process multiple spices.',
    theme: 'indian',
    reactions: INDIAN_REACTIONS,
    tileProps: COMMON_TILE_PROPS as any,
    spawns: {
        [ITEMS.CHILI]: 0.3,
        [ITEMS.TURMERIC]: 0.3,
        [ITEMS.TOMATO]: 0.2,
        [ITEMS.FIRE]: 0.1
    },
    layout: [
        { position: [0, 1], item: ITEMS.GRINDER, isStatic: true },
        { position: [2, 2], item: ITEMS.GRINDER, isStatic: true }
    ],
    winCondition: (state) => state.grid.flat().some(t => t?.name === ITEMS.CURRY_BASE)
};

// Level 12: Butter Chicken
export const Level12_ButterChicken: LevelConfig = {
    id: 'indian_3',
    worldId: 4,
    nextLevelId: null, // End of Game so far
    starThresholds: { 1: 150, 2: 120, 3: 90 },
    name: '12. Butter Chicken',
    description: 'The Ultimate Dish!',
    theme: 'indian',
    reactions: INDIAN_REACTIONS,
    tileProps: COMMON_TILE_PROPS as any,
    spawns: {
        [ITEMS.CHILI]: 0.2,
        [ITEMS.CHICKEN]: 0.2,
        [ITEMS.TOMATO]: 0.3,
        [ITEMS.FIRE]: 0.2,
        [ITEMS.TURMERIC]: 0.1
    },
    layout: [
        { position: [1, 2], item: ITEMS.GRINDER, isStatic: true }
    ],
    winCondition: (state) => state.grid.flat().some(t => t?.name === ITEMS.BUTTER_CHICKEN)
};
