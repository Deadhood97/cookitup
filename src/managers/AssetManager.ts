import { ITEMS } from '../engine/constants';

// Asset Mapping
import flourImg from '../assets/flour.png';
import waterImg from '../assets/water.png';
import fireImg from '../assets/fire.png';
import doughImg from '../assets/dough.png';
import breadImg from '../assets/bread.png';
import tomatoImg from '../assets/tomato.png';
import cheeseImg from '../assets/cheese.png';
import baseImg from '../assets/pizza_base.png';
import rawPizzaImg from '../assets/raw_pizza.png';
import bakedPizzaImg from '../assets/baked_pizza.png';
import crustImg from '../assets/crust.png';
import saucedCrustImg from '../assets/sauced_crust.png';
import soggyDoughImg from '../assets/soggy_dough.png';
import burntGoopImg from '../assets/burnt_goop.png';
import cleanImg from '../assets/clean.png';

// World 1 Expansion Assets
import meatImg from '../assets/meat.png';
import sandwichImg from '../assets/sandwich.png';
import sugarImg from '../assets/sugar.png';
import batterImg from '../assets/batter.png';
import cakeImg from '../assets/cake.png';
import knifeImg from '../assets/knife.png';
import sashimiImg from '../assets/sashimi.png';
import calzoneImg from '../assets/calzone.png';
import sushiImg from '../assets/sushi.png';
import fishImg from '../assets/fish.png';
import riceBallImg from '../assets/rice_ball.png';
import noriImg from '../assets/nori.png';
import sushiBaseImg from '../assets/sushi_base.png';

const ASSETS: Record<string, string> = {
    [ITEMS.FLOUR]: flourImg,
    [ITEMS.WATER]: waterImg,
    [ITEMS.FIRE]: fireImg,
    [ITEMS.DOUGH]: doughImg,
    [ITEMS.BREAD]: breadImg,
    [ITEMS.TOMATO]: tomatoImg,
    [ITEMS.CHEESE]: cheeseImg,
    [ITEMS.BASE]: baseImg,
    [ITEMS.RAW_PIZZA]: rawPizzaImg,
    [ITEMS.PIZZA]: bakedPizzaImg,
    [ITEMS.CRUST]: crustImg,
    [ITEMS.SAUCED_CRUST]: saucedCrustImg,
    [ITEMS.SOGGY_DOUGH]: soggyDoughImg,
    [ITEMS.BURNT_GOOP]: burntGoopImg,
    'Clean': cleanImg,
    // Expansion
    [ITEMS.MEAT]: meatImg,
    [ITEMS.SANDWICH]: sandwichImg,
    [ITEMS.SUGAR]: sugarImg,
    [ITEMS.BATTER]: batterImg,
    [ITEMS.CAKE]: cakeImg,
    [ITEMS.CALZONE]: calzoneImg,

    // World 3 Placeholders
    [ITEMS.RICE]: flourImg,
    [ITEMS.NORI]: noriImg,
    [ITEMS.FISH]: fishImg,
    [ITEMS.SASHIMI]: sashimiImg,
    [ITEMS.KNIFE]: knifeImg,
    [ITEMS.SUSHI]: sushiImg,
    'Cooked_Rice': riceBallImg,
    'Sushi_Base': sushiBaseImg,

    // World 4 Placeholders
    [ITEMS.CHILI]: tomatoImg,
    [ITEMS.TURMERIC]: cheeseImg,
    [ITEMS.PANEER]: cleanImg,
    [ITEMS.CHICKEN]: meatImg,
    [ITEMS.GRINDER]: crustImg,
    [ITEMS.CHILI_POWDER]: soggyDoughImg,
    [ITEMS.TURMERIC_POWDER]: flourImg,
    [ITEMS.CURRY_BASE]: saucedCrustImg,
    [ITEMS.BUTTER_CHICKEN]: bakedPizzaImg,
    [ITEMS.PANEER_TIKKA]: sandwichImg,
};

export class AssetManager {
    static getAsset(name: string): string {
        return ASSETS[name] || '';
    }
}
