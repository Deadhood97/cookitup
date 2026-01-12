import { type LevelConfig } from '../engine/types';
import { ITEMS, STATES } from '../engine/constants';

// Reusing the Pizzeria logic but splitting into levels

// Level 4: Margherita (The Classic)
export const Level4_Margherita: LevelConfig = {
    id: 'pizzeria_1',
    worldId: 2,
    nextLevelId: 'pizzeria_2',
    starThresholds: { 1: 100, 2: 75, 3: 50 },
    name: '4. Margherita',
    description: 'Bake First! Avoid Soggy Dough.',
    theme: 'pizzeria',
    reactions: [
        // STRICT PATH:
        // 1. Water + Flour = Dough
        { inputA: ITEMS.WATER, inputB: ITEMS.FLOUR, output: ITEMS.DOUGH, outputState: STATES.RAW },
        { inputA: ITEMS.FLOUR, inputB: ITEMS.WATER, output: ITEMS.DOUGH, outputState: STATES.RAW },

        // 2. Dough + Tomato = Base (Sauced Crust basically, but let's call it Pizza Base for clarity or reuse)
        // User said "Dough + Tomato = Base". 
        // My constant is ITEMS.SAUCED_CRUST or ITEMS.BASE? I have ITEMS.BASE in constants (check types? No, checked main.ts assets).
        // Let's use ITEMS.RAW_PIZZA as the "Sauced + Cheese" state?
        // Let's look at available constants: DOUGH, CRUST, SAUCED_CRUST, RAW_PIZZA.
        // User: Dough + Tomato = Base. Base + Fire = Trash. Base + Cheese = Raw Pizza.
        // My previous: Dough + Fire = Crust. Crust + Tomato = Sauced.

        // Let's align closest to User's "Order of Operations" without breaking assets.
        // Rule: MUST add ingredients BEFORE cooking.

        // Dough + Tomato -> Sauced Crust (Raw)
        { inputA: ITEMS.DOUGH, inputB: ITEMS.TOMATO, output: ITEMS.SAUCED_CRUST, outputState: STATES.RAW },
        { inputA: ITEMS.TOMATO, inputB: ITEMS.DOUGH, output: ITEMS.SAUCED_CRUST, outputState: STATES.RAW },

        // Sauced + Cheese -> Raw Pizza
        { inputA: ITEMS.SAUCED_CRUST, inputB: ITEMS.CHEESE, output: ITEMS.RAW_PIZZA, outputState: STATES.RAW },
        { inputA: ITEMS.CHEESE, inputB: ITEMS.SAUCED_CRUST, output: ITEMS.RAW_PIZZA, outputState: STATES.RAW },

        // Raw Pizza + Fire -> Pizza (Cooked)
        { inputA: ITEMS.FIRE, inputB: ITEMS.RAW_PIZZA, output: ITEMS.PIZZA, outputState: STATES.COOKED },
        { inputA: ITEMS.RAW_PIZZA, inputB: ITEMS.FIRE, output: ITEMS.PIZZA, outputState: STATES.COOKED },

        // FAIL STATES (The "Puzzle")

        // Dough + Fire -> Burnt (Trying to cook dough without toppings)
        { inputA: ITEMS.DOUGH, inputB: ITEMS.FIRE, output: ITEMS.BURNT_GOOP, outputState: STATES.BURNT },
        { inputA: ITEMS.FIRE, inputB: ITEMS.DOUGH, output: ITEMS.BURNT_GOOP, outputState: STATES.BURNT },

        // Sauced + Fire -> Burnt (Trying to cook without Cheese)
        { inputA: ITEMS.SAUCED_CRUST, inputB: ITEMS.FIRE, output: ITEMS.BURNT_GOOP, outputState: STATES.BURNT },
        { inputA: ITEMS.FIRE, inputB: ITEMS.SAUCED_CRUST, output: ITEMS.BURNT_GOOP, outputState: STATES.BURNT },

        // Dough + Cheese -> Soggy (Wrong order, tomato first?) OR maybe allowed?
        // User didn't specify, but "Order of Operations" implies Tomato -> Cheese.
        { inputA: ITEMS.DOUGH, inputB: ITEMS.CHEESE, output: ITEMS.SOGGY_DOUGH, outputState: STATES.SOGGY },
        { inputA: ITEMS.CHEESE, inputB: ITEMS.DOUGH, output: ITEMS.SOGGY_DOUGH, outputState: STATES.SOGGY },

        // Cleanup
        { inputA: ITEMS.WATER, inputB: ITEMS.SOGGY_DOUGH, output: null, outputState: STATES.RAW },
        { inputA: ITEMS.SOGGY_DOUGH, inputB: ITEMS.WATER, output: null, outputState: STATES.RAW },
        { inputA: ITEMS.WATER, inputB: ITEMS.BURNT_GOOP, output: null, outputState: STATES.RAW },
        { inputA: ITEMS.BURNT_GOOP, inputB: ITEMS.WATER, output: null, outputState: STATES.RAW },

        // TRAPS: Don't burn ingredients!
        { inputA: ITEMS.TOMATO, inputB: ITEMS.FIRE, output: ITEMS.BURNT_GOOP, outputState: STATES.BURNT },
        { inputA: ITEMS.FIRE, inputB: ITEMS.TOMATO, output: ITEMS.BURNT_GOOP, outputState: STATES.BURNT },
        { inputA: ITEMS.CHEESE, inputB: ITEMS.FIRE, output: ITEMS.BURNT_GOOP, outputState: STATES.BURNT },
        { inputA: ITEMS.FIRE, inputB: ITEMS.CHEESE, output: ITEMS.BURNT_GOOP, outputState: STATES.BURNT },
    ],
    tileProps: {
        [ITEMS.FLOUR]: { type: 'ingredient' },
        [ITEMS.WATER]: { type: 'element' },
        [ITEMS.FIRE]: { type: 'element', isStatic: true }, // Fire is static here? Or just the layout one? The engine copies isStatic from layout config.
        [ITEMS.DOUGH]: { type: 'ingredient' },
        [ITEMS.CRUST]: { type: 'ingredient' },
        [ITEMS.SAUCED_CRUST]: { type: 'ingredient' },
        [ITEMS.TOMATO]: { type: 'ingredient' },
        [ITEMS.CHEESE]: { type: 'ingredient' },
        [ITEMS.RAW_PIZZA]: { type: 'ingredient' },
        [ITEMS.PIZZA]: { type: 'result' },
        [ITEMS.SOGGY_DOUGH]: { type: 'blocker' },
        [ITEMS.BURNT_GOOP]: { type: 'blocker' },
    },
    // STATIC LAYOUT: Top-Right Fire
    layout: [
        { position: [0, 3], item: ITEMS.FIRE, isStatic: true }
    ],
    spawns: {
        [ITEMS.FLOUR]: 0.30, [ITEMS.WATER]: 0.30, [ITEMS.TOMATO]: 0.2, [ITEMS.CHEESE]: 0.20
        // NO FIRE SPAWN
    },
    difficultySpawns: {
        easy: { [ITEMS.FLOUR]: 0.40, [ITEMS.WATER]: 0.30, [ITEMS.TOMATO]: 0.20, [ITEMS.CHEESE]: 0.10 },
        medium: { [ITEMS.FLOUR]: 0.30, [ITEMS.WATER]: 0.30, [ITEMS.TOMATO]: 0.20, [ITEMS.CHEESE]: 0.20 },
        hard: { [ITEMS.FLOUR]: 0.25, [ITEMS.WATER]: 0.25, [ITEMS.TOMATO]: 0.25, [ITEMS.CHEESE]: 0.25 }
    },
    winCondition: (state) => state.grid.flat().some(t => t?.name === ITEMS.PIZZA)
};

// Level 5: Delivery Rush
export const Level5_Delivery: LevelConfig = {
    ...Level4_Margherita,
    id: 'pizzeria_2',
    nextLevelId: 'pizzeria_3',
    name: '5. Delivery Rush',
    description: 'Bake a Pizza before time runs out!',
    theme: 'pizzeria',
    timeLimit: 60, // 60 Seconds
    starThresholds: { 1: 150, 2: 120, 3: 90 },
    // Simplified: Win by making 1 Pizza within the time limit.
    winCondition: (state) => state.grid.flat().some(t => t?.name === ITEMS.PIZZA),
    // Inherit logic doesn't deep copy spawns automatically if we don't define them, 
    // but the engine looks up config.spawns. 
    // Since we used spread ...Level4, it has L4's spawns.
    // Let's make L5 Harder by default.
    difficultySpawns: {
        easy: { [ITEMS.FLOUR]: 0.35, [ITEMS.WATER]: 0.30, [ITEMS.TOMATO]: 0.2, [ITEMS.CHEESE]: 0.10, [ITEMS.FIRE]: 0.05 },
        medium: { [ITEMS.FLOUR]: 0.30, [ITEMS.WATER]: 0.25, [ITEMS.TOMATO]: 0.2, [ITEMS.CHEESE]: 0.15, [ITEMS.FIRE]: 0.10 },
        hard: { [ITEMS.FLOUR]: 0.20, [ITEMS.WATER]: 0.20, [ITEMS.TOMATO]: 0.25, [ITEMS.CHEESE]: 0.15, [ITEMS.FIRE]: 0.20 }
    }
}

// Level 6: Calzone Fold
export const Level6_Calzone: LevelConfig = {
    ...Level4_Margherita,
    id: 'pizzeria_3',
    nextLevelId: 'sushi_1', // Transition to World 3
    name: '6. Calzone Fold',
    description: 'Fold a Pizza with extra Dough.',
    theme: 'pizzeria',
    reactions: [
        ...Level4_Margherita.reactions,
        // Calzone = Pizza + Dough
        { inputA: ITEMS.PIZZA, inputB: ITEMS.DOUGH, output: ITEMS.CALZONE, outputState: STATES.COOKED },
        { inputA: ITEMS.DOUGH, inputB: ITEMS.PIZZA, output: ITEMS.CALZONE, outputState: STATES.COOKED },
    ],
    tileProps: {
        ...Level4_Margherita.tileProps,
        [ITEMS.CALZONE]: { type: 'result' }
    },
    difficultySpawns: {
        easy: { [ITEMS.FLOUR]: 0.40, [ITEMS.WATER]: 0.30, [ITEMS.TOMATO]: 0.15, [ITEMS.CHEESE]: 0.10, [ITEMS.FIRE]: 0.05 },
        medium: { [ITEMS.FLOUR]: 0.30, [ITEMS.WATER]: 0.25, [ITEMS.TOMATO]: 0.2, [ITEMS.CHEESE]: 0.15, [ITEMS.FIRE]: 0.10 },
        hard: { [ITEMS.FLOUR]: 0.25, [ITEMS.WATER]: 0.20, [ITEMS.TOMATO]: 0.20, [ITEMS.CHEESE]: 0.15, [ITEMS.FIRE]: 0.20 }
    },
    winCondition: (state) => state.grid.flat().some(t => t?.name === ITEMS.CALZONE)
};
