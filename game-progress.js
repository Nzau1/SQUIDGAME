// Game Progress Tracking System
const gameProgress = {
    // Initialize player data in localStorage or create new
    init() {
        if (!localStorage.getItem('squidGameProgress')) {
            localStorage.setItem('squidGameProgress', JSON.stringify({
                playerName: '',
                totalPoints: 0,
                gamesProgress: {
                    redLightGreenLight: {
                        completed: false,
                        score: 0,
                        bestTime: null,
                        attempts: 0
                    },
                    glassBridgeMemory: {
                        completed: false,
                        score: 0,
                        bridgesCrossed: 0,
                        attempts: 0
                    },
                    dalgonaCandyChallenge: {
                        completed: false,
                        score: 0,
                        shapesCompleted: [],
                        attempts: 0
                    }
                }
            }));
        }
        return JSON.parse(localStorage.getItem('squidGameProgress'));
    },

    // Update progress for a specific game
    updateGame(gameName, gameData) {
        const progress = this.getProgress();
        progress.gamesProgress[gameName] = {
            ...progress.gamesProgress[gameName],
            ...gameData
        };
        progress.totalPoints = this.calculateTotalPoints(progress);
        this.saveProgress(progress);
    },

    // Calculate total points across all games
    calculateTotalPoints(progress) {
        let total = 0;
        Object.values(progress.gamesProgress).forEach(game => {
            total += game.score;
        });
        return total;
    },

    // Get current progress
    getProgress() {
        return JSON.parse(localStorage.getItem('squidGameProgress'));
    },

    // Save progress
    saveProgress(progress) {
        localStorage.setItem('squidGameProgress', JSON.stringify(progress));
    },

    // Reset all progress
    resetProgress() {
        localStorage.removeItem('squidGameProgress');
        this.init();
    }
};

// Example usage for each game:
function updateRedLightGreenLight(timeCompleted, succeeded) {
    const score = succeeded ? 100 : 0;
    gameProgress.updateGame('redLightGreenLight', {
        completed: succeeded,
        score: score,
        bestTime: timeCompleted,
        attempts: gameProgress.getProgress().gamesProgress.redLightGreenLight.attempts + 1
    });
}

function updateGlassBridge(bridgesCrossed, succeeded) {
    const score = bridgesCrossed * 10;
    gameProgress.updateGame('glassBridgeMemory', {
        completed: succeeded,
        score: score,
        bridgesCrossed: bridgesCrossed,
        attempts: gameProgress.getProgress().gamesProgress.glassBridgeMemory.attempts + 1
    });
}

function updateDalgona(shape, succeeded) {
    const progress = gameProgress.getProgress();
    const shapes = progress.gamesProgress.dalgonaCandyChallenge.shapesCompleted;
    if (succeeded && !shapes.includes(shape)) {
        shapes.push(shape);
    }
    gameProgress.updateGame('dalgonaCandyChallenge', {
        completed: shapes.length >= 4,
        score: shapes.length * 25,
        shapesCompleted: shapes,
        attempts: progress.gamesProgress.dalgonaCandyChallenge.attempts + 1
    });
}
