const db = require('../../other/database');

class UnlockedCharacter {
    constructor(userid, characterid) {
        this.userid = userid;
        this.characterid = characterid;
    }

    static async findByUserId(userid) {
        return new Promise((resolve, reject) => {
            db.query(`
                SELECT c.* 
                FROM characters c
                INNER JOIN unlocked_characters uc ON c.characterid = uc.characterid
                WHERE uc.userid = ?
            `, [userid], (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results);
            });
        });
    }

    static async unlock(userid, characterid) {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO unlocked_characters (userid, characterid) VALUES (?, ?)',
                [userid, characterid],
                (err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(result);
                }
            );
        });
    }

    static async isUnlocked(userid, characterid) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM unlocked_characters WHERE userid = ? AND characterid = ?',
                [userid, characterid],
                (err, results) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(results.length > 0);
                }
            );
        });
    }
}

module.exports = UnlockedCharacter;