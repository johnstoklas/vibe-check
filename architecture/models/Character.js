const db = require('../../other/database');

class Character {
    constructor(characterid, name, difficulty) {
        this.characterid = characterid;
        this.name = name;
        this.difficulty = difficulty;
    }

    static async findAll() {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM characters', (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results);
            });
        });
    }

    static async findById(characterid) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM characters WHERE characterid = ?', [characterid], (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results[0]);
            });
        });
    }

}

module.exports = Character;