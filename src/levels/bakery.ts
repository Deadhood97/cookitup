import { type LevelConfig } from '../engine/types';
import { ITEMS } from '../engine/constants';
import { BASIC_REACTIONS, TILE_PROPS } from '../engine/config';

export const BakeryLevel: LevelConfig = {
    id: 'bakery_1',
    worldId: 1,
    nextLevelId: 'pizzeria_1',
    starThresholds: { 1: 50, 2: 30, 3: 15 },

    name: 'The Bakery',
    description: 'Bake your first loaf of Bread.',
    reactions: BASIC_REACTIONS,
    tileProps: TILE_PROPS,
    spawns: {
        [ITEMS.FLOUR]: 0.6,
        [ITEMS.WATER]: 0.3,
        [ITEMS.FIRE]: 0.1,
    },
    winCondition: (state) => {
        for (let r = 0; r < state.grid.length; r++) {
            for (let c = 0; c < state.grid.length; c++) {
                const tile = state.grid[r][c];
                if (tile && tile.name === ITEMS.BREAD) {
                    return true;
                }
            }
        }
        return false;
    }
};
