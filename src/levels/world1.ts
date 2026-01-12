import { type LevelConfig, type TileType } from '../engine/types';
import { ITEMS, STATES } from '../engine/constants';
import { BASIC_REACTIONS } from '../engine/config';

// Level 1: Morning Toast (Tutorial) already exists as BakeryLevel in main, but let's formalize
export const Level1_Toast: LevelConfig = {
    id: 'bakery_1',
    worldId: 1,
    nextLevelId: 'bakery_2',
    starThresholds: { 1: 50, 2: 30, 3: 15 },
    name: '1. Morning Toast',
    description: 'Make a warm Loaf of Bread.',
    theme: 'bakery',
    reactions: BASIC_REACTIONS,
    tileProps: {
        [ITEMS.FLOUR]: { type: 'ingredient' },
        [ITEMS.WATER]: { type: 'element' },
        [ITEMS.FIRE]: { type: 'element' },
        [ITEMS.DOUGH]: { type: 'ingredient' },
        [ITEMS.BREAD]: { type: 'result' },
    },
    spawns: {
        [ITEMS.FLOUR]: 0.6,
        [ITEMS.WATER]: 0.3,
        [ITEMS.FIRE]: 0.1,
    },
    winCondition: (state) => state.grid.flat().some(t => t?.name === ITEMS.BREAD && t.state === STATES.COOKED)
};

// Level 2: The Sandwich
export const Level2_Sandwich: LevelConfig = {
    id: 'bakery_2',
    worldId: 1,
    nextLevelId: 'bakery_3',
    starThresholds: { 1: 80, 2: 50, 3: 30 },
    name: '2. The Sandwich',
    description: 'Combine Bread and Meat!',
    theme: 'bakery',
    reactions: [
        ...BASIC_REACTIONS,
        // Sandwich
        { inputA: ITEMS.BREAD, inputB: ITEMS.MEAT, output: ITEMS.SANDWICH, outputState: STATES.RAW },
        { inputA: ITEMS.MEAT, inputB: ITEMS.BREAD, output: ITEMS.SANDWICH, outputState: STATES.RAW }, // symmetric
    ],
    tileProps: {
        [ITEMS.FLOUR]: { type: 'ingredient' },
        [ITEMS.WATER]: { type: 'element' },
        [ITEMS.FIRE]: { type: 'element' },
        [ITEMS.DOUGH]: { type: 'ingredient' },
        [ITEMS.BREAD]: { type: 'ingredient' }, // Bread is ingredient here
        [ITEMS.MEAT]: { type: 'ingredient' },
        [ITEMS.SANDWICH]: { type: 'result' },
    },
    spawns: {
        [ITEMS.FLOUR]: 0.5,
        [ITEMS.WATER]: 0.25,
        [ITEMS.FIRE]: 0.1,
        [ITEMS.MEAT]: 0.15, // Rare meat
    },
    winCondition: (state) => state.grid.flat().some(t => t?.name === ITEMS.SANDWICH)
};

// Level 3: The Celebration Cake
export const Level3_Cake: LevelConfig = {
    id: 'bakery_3',
    worldId: 1,
    nextLevelId: 'pizzeria_1', // To World 2
    starThresholds: { 1: 120, 2: 90, 3: 60 },
    name: '3. Celebration Cake',
    description: 'Dough + Sugar -> Batter. Bake it!',
    theme: 'bakery',
    reactions: [
        // Dough base
        { inputA: ITEMS.WATER, inputB: ITEMS.FLOUR, output: ITEMS.DOUGH, outputState: STATES.RAW },
        { inputA: ITEMS.FLOUR, inputB: ITEMS.WATER, output: ITEMS.DOUGH, outputState: STATES.RAW },

        // Batter
        { inputA: ITEMS.DOUGH, inputB: ITEMS.SUGAR, output: ITEMS.BATTER, outputState: STATES.RAW },
        { inputA: ITEMS.SUGAR, inputB: ITEMS.DOUGH, output: ITEMS.BATTER, outputState: STATES.RAW },

        // Cake
        { inputA: ITEMS.BATTER, inputB: ITEMS.FIRE, output: ITEMS.CAKE, outputState: STATES.COOKED },
        { inputA: ITEMS.FIRE, inputB: ITEMS.BATTER, output: ITEMS.CAKE, outputState: STATES.COOKED },

        // TRAP: Dough + Fire = Bread (Distraction)
        { inputA: ITEMS.DOUGH, inputB: ITEMS.FIRE, output: ITEMS.BREAD, outputState: STATES.COOKED },
        { inputA: ITEMS.FIRE, inputB: ITEMS.DOUGH, output: ITEMS.BREAD, outputState: STATES.COOKED },
    ],
    tileProps: {
        [ITEMS.FLOUR]: { type: 'ingredient' },
        [ITEMS.WATER]: { type: 'element' },
        [ITEMS.FIRE]: { type: 'element' },
        [ITEMS.DOUGH]: { type: 'ingredient' },
        [ITEMS.BREAD]: { type: 'result' }, // Trap Result
        [ITEMS.SUGAR]: { type: 'ingredient' },
        [ITEMS.BATTER]: { type: 'ingredient' },
        [ITEMS.CAKE]: { type: 'result' },
    },
    spawns: {
        [ITEMS.FLOUR]: 0.4,
        [ITEMS.WATER]: 0.2,
        [ITEMS.FIRE]: 0.1,
        [ITEMS.SUGAR]: 0.3,
    },
    winCondition: (state) => state.grid.flat().some(t => t?.name === ITEMS.CAKE)
};
