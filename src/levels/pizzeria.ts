import { type LevelConfig } from '../engine/types';
import { ITEMS, STATES } from '../engine/constants';

export const PizzeriaLevel: LevelConfig = {
    id: 'pizzeria_1',
    worldId: 2,
    nextLevelId: null, // End of content for now
    starThresholds: { 1: 100, 2: 75, 3: 50 },

    name: 'The Pizzeria (Hard)',
    description: 'Bake First, Top Later! Avoid Soggy Dough and Burnt Goop.',
    reactions: [
        // --- The Golden Path ---
        // 1. Dough
        { inputA: ITEMS.WATER, inputB: ITEMS.FLOUR, output: ITEMS.DOUGH, outputState: STATES.RAW },
        { inputA: ITEMS.FLOUR, inputB: ITEMS.WATER, output: ITEMS.DOUGH, outputState: STATES.RAW },

        // 2. Pre-Bake (Dough + Fire -> Crust)
        { inputA: ITEMS.DOUGH, inputB: ITEMS.FIRE, output: ITEMS.CRUST, outputState: STATES.COOKED },
        { inputA: ITEMS.FIRE, inputB: ITEMS.DOUGH, output: ITEMS.CRUST, outputState: STATES.COOKED },

        // 3. Sauce (Crust + Tomato -> Sauced Crust)
        { inputA: ITEMS.CRUST, inputB: ITEMS.TOMATO, output: ITEMS.SAUCED_CRUST, outputState: STATES.RAW },
        { inputA: ITEMS.TOMATO, inputB: ITEMS.CRUST, output: ITEMS.SAUCED_CRUST, outputState: STATES.RAW },

        // 4. Cheese (Sauced Crust + Cheese -> Raw Pizza)
        { inputA: ITEMS.SAUCED_CRUST, inputB: ITEMS.CHEESE, output: ITEMS.RAW_PIZZA, outputState: STATES.RAW },
        { inputA: ITEMS.CHEESE, inputB: ITEMS.SAUCED_CRUST, output: ITEMS.RAW_PIZZA, outputState: STATES.RAW },

        // 5. Final Bake (Raw Pizza + Fire -> Pizza)
        { inputA: ITEMS.FIRE, inputB: ITEMS.RAW_PIZZA, output: ITEMS.PIZZA, outputState: STATES.COOKED },
        { inputA: ITEMS.RAW_PIZZA, inputB: ITEMS.FIRE, output: ITEMS.PIZZA, outputState: STATES.COOKED },

        // --- Fail States (The Trap) ---

        // Soggy Dough: Adding wet ingredients to raw dough
        { inputA: ITEMS.DOUGH, inputB: ITEMS.TOMATO, output: ITEMS.SOGGY_DOUGH, outputState: STATES.SOGGY },
        { inputA: ITEMS.TOMATO, inputB: ITEMS.DOUGH, output: ITEMS.SOGGY_DOUGH, outputState: STATES.SOGGY },

        { inputA: ITEMS.DOUGH, inputB: ITEMS.CHEESE, output: ITEMS.SOGGY_DOUGH, outputState: STATES.SOGGY },
        { inputA: ITEMS.CHEESE, inputB: ITEMS.DOUGH, output: ITEMS.SOGGY_DOUGH, outputState: STATES.SOGGY },

        // Burnt Goop: Exposing ingredients to fire
        { inputA: ITEMS.TOMATO, inputB: ITEMS.FIRE, output: ITEMS.BURNT_GOOP, outputState: STATES.BURNT },
        { inputA: ITEMS.FIRE, inputB: ITEMS.TOMATO, output: ITEMS.BURNT_GOOP, outputState: STATES.BURNT },

        { inputA: ITEMS.CHEESE, inputB: ITEMS.FIRE, output: ITEMS.BURNT_GOOP, outputState: STATES.BURNT },
        { inputA: ITEMS.FIRE, inputB: ITEMS.CHEESE, output: ITEMS.BURNT_GOOP, outputState: STATES.BURNT },

        // --- Cleanup (Dishwasher Mechanic) ---
        { inputA: ITEMS.WATER, inputB: ITEMS.SOGGY_DOUGH, output: null, outputState: STATES.RAW },
        { inputA: ITEMS.SOGGY_DOUGH, inputB: ITEMS.WATER, output: null, outputState: STATES.RAW },

        { inputA: ITEMS.WATER, inputB: ITEMS.BURNT_GOOP, output: null, outputState: STATES.RAW },
        { inputA: ITEMS.BURNT_GOOP, inputB: ITEMS.WATER, output: null, outputState: STATES.RAW },
    ],
    tileProps: {
        [ITEMS.FLOUR]: { type: 'ingredient' },
        [ITEMS.WATER]: { type: 'element' },
        [ITEMS.FIRE]: { type: 'element' },
        [ITEMS.DOUGH]: { type: 'ingredient' },
        [ITEMS.CRUST]: { type: 'ingredient' },
        [ITEMS.SAUCED_CRUST]: { type: 'ingredient' },
        [ITEMS.TOMATO]: { type: 'ingredient' },
        [ITEMS.CHEESE]: { type: 'ingredient' },

        [ITEMS.BASE]: { type: 'ingredient' }, // Legacy/Unused in new logic but kept for safety
        [ITEMS.RAW_PIZZA]: { type: 'ingredient' },
        [ITEMS.PIZZA]: { type: 'result' },

        [ITEMS.SOGGY_DOUGH]: { type: 'blocker' },
        [ITEMS.BURNT_GOOP]: { type: 'blocker' },
    },
    spawns: {
        [ITEMS.FLOUR]: 0.35,
        [ITEMS.WATER]: 0.25,
        [ITEMS.TOMATO]: 0.2, // slightly rare
        [ITEMS.CHEESE]: 0.15, // rare
        [ITEMS.FIRE]: 0.05, // VERY rare catalyst
    },
    winCondition: (state) => {
        for (let r = 0; r < state.grid.length; r++) {
            for (let c = 0; c < state.grid.length; c++) {
                const tile = state.grid[r][c];
                if (tile && tile.name === ITEMS.PIZZA) {
                    return true;
                }
            }
        }
        return false;
    }
};
