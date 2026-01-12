export interface LevelProgress {
    stars: number;
    unlocked: boolean;
}

export interface PlayerProgress {
    levels: Record<string, LevelProgress>;
    lastPlayedLevel: string;
}

const STORAGE_KEY = 'elemental_chef_progress_v1';

export const ProgressManager = {
    validateProgression(progress: PlayerProgress, levels: Record<string, any>) {
        // Self-heal: Ensure if level N is done, N+1 is unlocked
        Object.keys(levels).forEach(id => {
            const levelConfig = levels[id];
            const meta = progress.levels[id];
            if (meta && meta.stars > 0 && levelConfig.nextLevelId) {
                // If completed and has next level, ensure next is unlocked
                if (!progress.levels[levelConfig.nextLevelId]) {
                    console.log(`Auto-unlocking fixed level: ${levelConfig.nextLevelId}`);
                    this.unlockLevel(progress, levelConfig.nextLevelId);
                }
            }
        });
    },

    load(levels?: Record<string, any>): PlayerProgress {
        const stored = localStorage.getItem(STORAGE_KEY);
        let progress: PlayerProgress;

        if (stored) {
            progress = JSON.parse(stored);
        } else {
            progress = this.getInitialProgress();
        }

        // Run validation if levels are provided
        if (levels) {
            this.validateProgression(progress, levels);
        }

        return progress;
    },

    save(progress: PlayerProgress) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    },

    getInitialProgress(): PlayerProgress {
        return {
            levels: {
                'bakery_1': { stars: 0, unlocked: true }, // First level always unlocked
            },
            lastPlayedLevel: 'bakery_1'
        };
    },

    unlockLevel(progress: PlayerProgress, levelId: string) {
        if (!progress.levels[levelId]) {
            progress.levels[levelId] = { stars: 0, unlocked: true };
            this.save(progress);
        }
    },

    completeLevel(progress: PlayerProgress, levelId: string, stars: number, nextLevelId?: string | null) {
        // Update current level stars if better
        if (!progress.levels[levelId]) {
            progress.levels[levelId] = { stars: 0, unlocked: true };
        }

        progress.levels[levelId].stars = Math.max(progress.levels[levelId].stars, stars);

        // Unlock next
        if (nextLevelId) {
            this.unlockLevel(progress, nextLevelId);
        }

        this.save(progress);
    }
};
