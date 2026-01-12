export const ITEMS = {
    FLOUR: 'Flour',
    WATER: 'Water',
    FIRE: 'Fire',
    DOUGH: 'Dough',
    BREAD: 'Bread',
    TOMATO: 'Tomato',
    CHEESE: 'Cheese',
    BASE: 'Base',
    RAW_PIZZA: 'Raw Pizza',
    PIZZA: 'Pizza',
    CRUST: 'Crust',
    SAUCED_CRUST: 'Sauced Crust',
    SOGGY_DOUGH: 'Soggy Dough',
    BURNT_GOOP: 'Burnt_Goop',

    // Bakery Expansion
    MEAT: 'Meat',
    SANDWICH: 'Sandwich',
    SUGAR: 'Sugar',
    BATTER: 'Sweet_Batter',
    CAKE: 'Cake',

    // Pizzeria Expansion
    CALZONE: 'Calzone',

    // World 3: Sushi
    RICE: 'Rice',
    NORI: 'Nori',
    FISH: 'Fish',
    KNIFE: 'Knife', // Tool/Obstacle
    SUSHI: 'Sushi',
    SASHIMI: 'Sashimi',

    // World 4: Indian
    CHILI: 'Chili',
    TURMERIC: 'Turmeric',
    PANEER: 'Paneer',
    CHICKEN: 'Chicken',
    GRINDER: 'Grinder', // Tool
    CHILI_POWDER: 'Chili_Powder',
    TURMERIC_POWDER: 'Turmeric_Powder',
    CURRY_BASE: 'Curry_Base',
    BUTTER_CHICKEN: 'Butter_Chicken',
    PANEER_TIKKA: 'Paneer_Tikka',
} as const;

export const STATES = {
    RAW: 'raw',
    COOKED: 'cooked',
    BURNT: 'burnt',
    SOGGY: 'soggy',
} as const;

export const SCORES = {
    MERGE_BASE: 10,
    REACTION_BASE: 50,
    WIN_BONUS: 1000,
};
