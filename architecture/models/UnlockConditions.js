const mysql = require('mysql2/promise');
const connection = require('../database').databaseConnection;

class UnlockConditions {
    static async checkScoreUnlock(userID, requiredScore) {
        const [scores] = await connection.query(
            'SELECT topscore FROM games WHERE userid = ? ORDER BY topscore DESC LIMIT 1',
            [userID]
        );
        return scores.length > 0 && scores[0].topscore >= requiredScore;
    }

    static async checkGamesPlayedUnlock(userID, requiredGames) {
        const [games] = await connection.query(
            'SELECT COUNT(*) as gameCount FROM games WHERE userid = ?',
            [userID]
        );
        return games[0].gameCount >= requiredGames;
    }

    static async checkMoneyUnlock(userID, requiredMoney) {
        const [money] = await connection.query(
            'SELECT topmoney FROM games WHERE userid = ? ORDER BY topmoney DESC LIMIT 1',
            [userID]
        );
        return money.length > 0 && money[0].topmoney >= requiredMoney;
    }

    static async checkUnlockCondition(characterId, userID) {
        switch(characterId) {
            // First 8 characters (1-8)
            case 1: case 2: case 3: case 4: case 5: case 6: case 7: case 8:
                return true; // Always unlocked for new accounts

            // Score-based unlocks (9-13)
            case 9:
                return await this.checkScoreUnlock(userID, 500);
            case 10:
                return await this.checkScoreUnlock(userID, 1000);
            case 11:
                return await this.checkScoreUnlock(userID, 2000);
            case 12:
                return await this.checkScoreUnlock(userID, 3500);
            case 13:
                return await this.checkScoreUnlock(userID, 5000);

            // Games played unlocks (14-18)
            case 14:
                return await this.checkGamesPlayedUnlock(userID, 5);
            case 15:
                return await this.checkGamesPlayedUnlock(userID, 10);
            case 16:
                return await this.checkGamesPlayedUnlock(userID, 25);
            case 17:
                return await this.checkGamesPlayedUnlock(userID, 50);
            case 18:
                return await this.checkGamesPlayedUnlock(userID, 100);

            // Special unlocks (19-20)
            case 19:
                return await this.checkMoneyUnlock(userID, 10000);
            case 20:
                // Perfect game - score 100 and earn at least 5000 money
                const [perfect] = await connection.query(
                    'SELECT COUNT(*) as count FROM games WHERE userid = ? AND topscore = 100 AND topmoney >= 5000',
                    [userID]
                );
                return perfect[0].count > 0;

            default:
                return false;
        }
    }
}

module.exports = { UnlockConditions };