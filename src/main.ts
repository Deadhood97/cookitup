import './style.css';
import { GameEngine } from './engine/GameEngine';
import { type LevelConfig } from './engine/types';
import { ProgressManager } from './managers/ProgressManager';
import { GameRenderer } from './views/GameRenderer';
import { renderWorldMap } from './views/WorldMap';

// Level Imports
import { Level1_Toast, Level2_Sandwich, Level3_Cake } from './levels/world1';
import { Level4_Margherita, Level5_Delivery, Level6_Calzone } from './levels/world2';
import { Level7_RiceFields, Level8_TheKnife, Level9_SushiMaster } from './levels/world3';
import { Level10_SpiceMarket, Level11_TheDailyGrind, Level12_ButterChicken } from './levels/world4';

const LEVELS: Record<string, LevelConfig> = {
  [Level1_Toast.id]: Level1_Toast,
  [Level2_Sandwich.id]: Level2_Sandwich,
  [Level3_Cake.id]: Level3_Cake,

  [Level4_Margherita.id]: Level4_Margherita,
  [Level5_Delivery.id]: Level5_Delivery,
  [Level6_Calzone.id]: Level6_Calzone,

  [Level7_RiceFields.id]: Level7_RiceFields,
  [Level8_TheKnife.id]: Level8_TheKnife,
  [Level9_SushiMaster.id]: Level9_SushiMaster,

  [Level10_SpiceMarket.id]: Level10_SpiceMarket,
  [Level11_TheDailyGrind.id]: Level11_TheDailyGrind,
  [Level12_ButterChicken.id]: Level12_ButterChicken,
};

const app = document.querySelector<HTMLDivElement>('#app')!;
let engine: GameEngine | null = null;
const renderer = new GameRenderer();

// --- View Management ---

function showMap() {
  const progress = ProgressManager.load(LEVELS);
  renderer.clearTimer(); // Ensure timer is killed
  app.innerHTML = renderWorldMap(progress);

  // Attach Listeners to ALL level cards (Universal Access)
  document.querySelectorAll('.level-card').forEach(node => {
    node.addEventListener('click', () => {
      const id = (node as HTMLElement).dataset.id!;
      launchLevel(LEVELS[id]);
    });
  });
}

function launchLevel(config: LevelConfig) {
  if (!config) return;

  // Difficulty Selection Screen
  app.innerHTML = `
      <div class="header-bar">
          <button id="back-btn">← Map</button>
          <div class="level-title">${config.name}</div>
      </div>
      <div class="menu-container">
          <h2>Select Difficulty</h2>
          <p class="level-desc">${config.description}</p>
          
          <div class="difficulty-options">
              <button class="diff-btn" data-diff="easy">
                  <span class="diff-name">Easy</span>
                  <span class="diff-desc">Relaxed Spawns</span>
              </button>
              <button class="diff-btn" data-diff="medium">
                  <span class="diff-name">Medium</span>
                  <span class="diff-desc">Standard Challenge</span>
              </button>
              <button class="diff-btn" data-diff="hard">
                  <span class="diff-name">Hard</span>
                  <span class="diff-desc">Chaos Mode</span>
              </button>
          </div>
      </div>
  `;

  document.getElementById('back-btn')!.addEventListener('click', showMap);

  document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const diff = (btn as HTMLElement).dataset.diff as any;
      startGame(config, diff);
    });
  });
}

function startGame(config: LevelConfig, difficulty: 'easy' | 'medium' | 'hard') {
  engine = new GameEngine(config, difficulty);
  engine.initialize();

  renderer.setEngine(engine);

  let timeLeft = config.timeLimit || 0;

  // UI Structure
  app.innerHTML = `
      <div class="header-bar">
          <button id="back-btn">← Map</button>
          <div class="level-info">
             <div class="level-title">${config.name} <span class="diff-badge">${difficulty.toUpperCase()}</span></div>
             <div class="next-preview">
                <span>Next:</span>
                <img id="next-tile-icon" src="" class="icon-small" />
             </div>
             ${config.timeLimit ? `<div id="timer" class="timer-display"></div>` : ''}
          </div>
      </div>
      <div class="game-container theme-${config.theme || 'default'}">
        <div class="grid-bg">
          ${Array(16).fill('<div class="grid-cell"></div>').join('')}
        </div>
        <div id="tile-container"></div>
        <div id="overlay" class="hidden">
            <h2 id="overlay-msg">Game Over</h2>
            <button id="restart-btn">Try Again</button>
            <button id="next-level-btn" class="hidden">Next Level</button>
        </div>
      </div>
      <div class="controls-area">
          <button id="undo-btn" class="control-btn" disabled>↺ Undo</button>
          <div class="arrow-keys-hint">Use Arrow Keys</div>
          <button id="help-btn" class="icon-btn" aria-label="Recipes">?</button>
      </div>
      <div id="score">Score: 0 | Moves: 0</div>
      
      <div id="recipe-slider" class="slider hidden-right">
          <button id="close-help-btn" class="close-btn">×</button>
          <h2>Recipes & Tips</h2>
          <div id="recipe-list"></div>
      </div>
    `;

  // Wire up Events
  engine.on('reaction', (data: any) => {
    let type: any = 'cooked';
    if (data.type === 'burnt' || data.type === 'soggy') type = data.type;
    renderer.showFloatingText(data.text, type);
  });

  // Initial Render
  renderer.render(engine.getState(), engine);

  // Start Timer if needed
  if (config.timeLimit) {
    renderer.startTimer(config.timeLimit, () => {
      // Time Up Callback
      const state = engine!.getState();
      if (state.status === 'playing') {
        state.status = 'lost'; // Modify state directly for now, engine should handle this better
        renderer.render(state, engine!);
      }
    });
  }

  // Event Listeners
  document.getElementById('back-btn')!.addEventListener('click', () => {
    renderer.clearTimer();
    showMap();
  });

  document.getElementById('restart-btn')!.addEventListener('click', () => {
    startGame(config, difficulty);
  });

  document.getElementById('undo-btn')!.addEventListener('click', () => {
    if (engine && engine.canUndo()) {
      engine.undo();
      renderer.render(engine.getState(), engine);
    }
  });

  const helpBtn = document.getElementById('help-btn')!;
  const closeHelpBtn = document.getElementById('close-help-btn')!;
  const recipeSlider = document.getElementById('recipe-slider')!;

  helpBtn.addEventListener('click', () => {
    recipeSlider.classList.remove('hidden-right');
    renderer.renderRecipes(config);
  });

  closeHelpBtn.addEventListener('click', () => {
    recipeSlider.classList.add('hidden-right');
  });

  document.getElementById('next-level-btn')!.addEventListener('click', () => {
    renderer.clearTimer();
    showMap();
  });
}

// Input Handling
window.addEventListener('keydown', (e) => {
  if (!engine) return;

  let direction: 'up' | 'down' | 'left' | 'right' | null = null;
  switch (e.key) {
    case 'ArrowUp': direction = 'up'; break;
    case 'ArrowDown': direction = 'down'; break;
    case 'ArrowLeft': direction = 'left'; break;
    case 'ArrowRight': direction = 'right'; break;
  }

  if (direction) {
    e.preventDefault();
    engine.move(direction);
    renderer.render(engine.getState(), engine);
  }
});

// Start App
showMap();
