import { type PlayerProgress } from '../managers/ProgressManager';
import { Level1_Toast, Level2_Sandwich, Level3_Cake } from '../levels/world1';
import { Level4_Margherita, Level5_Delivery, Level6_Calzone } from '../levels/world2';
import { Level7_RiceFields, Level8_TheKnife, Level9_SushiMaster } from '../levels/world3';
import { Level10_SpiceMarket, Level11_TheDailyGrind, Level12_ButterChicken } from '../levels/world4';

// Ordered List of Levels for the Map
const LEVEL_LIST = [
    Level1_Toast, Level2_Sandwich, Level3_Cake,
    Level4_Margherita, Level5_Delivery, Level6_Calzone,
    Level7_RiceFields, Level8_TheKnife, Level9_SushiMaster,
    Level10_SpiceMarket, Level11_TheDailyGrind, Level12_ButterChicken
];

export function renderWorldMap(progress: PlayerProgress): string {
    // Group levels by World
    const worlds: Record<number, typeof LEVEL_LIST> = {
        1: [], 2: [], 3: [], 4: []
    };

    LEVEL_LIST.forEach(level => {
        if (worlds[level.worldId]) {
            worlds[level.worldId].push(level);
        }
    });

    const worldNames: Record<number, string> = {
        1: 'The Bakery',
        2: 'The Pizzeria',
        3: 'Sushi Master',
        4: 'Indian Cuisine'
    };

    const worldThemes: Record<number, string> = {
        1: 'bakery',
        2: 'pizzeria',
        3: 'sushi',
        4: 'indian'
    };

    return `
    <div id="world-map" class="open-world-layout">
        <h1 class="main-title">The Culinary Journey</h1>
        
        ${[1, 2, 3, 4].map(worldId => {
        const levels = worlds[worldId];
        const theme = worldThemes[worldId];

        return `
            <div class="world-section theme-${theme}">
                <h2 class="world-title">${worldNames[worldId]}</h2>
                <div class="level-grid">
                    ${levels.map((level, index) => {
            const data = progress.levels[level.id];
            const stars = data?.stars || 0;
            // Always clickable, but maybe show visuals for completed
            const isCompleted = stars > 0;

            return `
                        <div class="level-card ${isCompleted ? 'completed' : ''}" data-id="${level.id}">
                            <div class="level-card-header">
                                <span class="level-number">${level.name.split('.')[0]}</span>
                                ${isCompleted ? '<span class="check-icon">✓</span>' : ''}
                            </div>
                            <div class="level-card-name">${level.name.split('. ')[1]}</div>
                            <div class="stars small">
                                ${Array(3).fill(0).map((_, i) =>
                `<span class="star ${i < stars ? 'filled' : ''}">★</span>`
            ).join('')}
                            </div>
                        </div>
                    `;
        }).join('')}
                </div>
            </div>
        `;
    }).join('')}
    </div>
    `;
}
