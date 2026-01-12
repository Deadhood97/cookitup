import { type Reaction, type TileType } from './types';
import { ITEMS, STATES } from './constants';

export const BASIC_REACTIONS: Reaction[] = [
    // transformations
    { inputA: ITEMS.WATER, inputB: ITEMS.FLOUR, output: ITEMS.DOUGH, outputState: STATES.RAW },
    { inputA: ITEMS.FLOUR, inputB: ITEMS.WATER, output: ITEMS.DOUGH, outputState: STATES.RAW }, // Symmetric

    // cooking
    { inputA: ITEMS.FIRE, inputB: ITEMS.DOUGH, output: ITEMS.BREAD, outputState: STATES.COOKED },
    { inputA: ITEMS.DOUGH, inputB: ITEMS.FIRE, output: ITEMS.BREAD, outputState: STATES.COOKED },
];

export const TILE_PROPS: Record<string, { type: TileType }> = {
    [ITEMS.FLOUR]: { type: 'ingredient' },
    [ITEMS.WATER]: { type: 'element' },
    [ITEMS.FIRE]: { type: 'element' },
    [ITEMS.DOUGH]: { type: 'ingredient' },
    [ITEMS.BREAD]: { type: 'result' },
};
