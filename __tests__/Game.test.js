const { Game } = require('../architecture/controllers/game');
const { UnlockedCharacters } = require('../architecture/models/UnlockedCharacters');

jest.mock('express-mysql-session', () => {
    return () => { return class MockSessionStore {}; };
});
jest.mock('../architecture/models/UnlockedCharacters');
jest.mock('../architecture/utility', () => ({
    alertRedirect: jest.fn(),
    noAlertRedirect: jest.fn()
}));

describe('Game class', () => {

    let req;
    let res;

    beforeEach(() => {
        req = {
            session: {
                isAuth: true,
                accountID: 1,
                isGameRunning: false
            },
            body: {}
        };

        res = {};
    });

    test('game initialization', async () => {
        const fakeTraits = [
            { trait_name: 'Compliments', is_positive: 1 },
            { trait_name: 'Small Gift', is_positive: 0 }
        ];

        const fakeCharacters = new Array(5).fill(null).map((_, i) => ({
            id: i,
            name: `Character ${i}`,
            traits: fakeTraits,
            difficulty: 1
        }));

        UnlockedCharacters.selectRandomWithTraits.mockResolvedValue(fakeCharacters);

        const game = await Game.init(req, res);

        expect(game.characters.length).toBe(5);
        expect(game.score).toBe(100);
        expect(game.money).toBe(50);
        expect(game.round).toBe(1);
        expect(req.session.isGameRunning).toBe(true);
    });

    test('playRound changes character health and player score', async () => {
        const req = {
            session: { isAuth: true, accountID: 1, isGameRunning: false },
            body: { char_index: 0, action_index: 0 }
        };
        const res = {};
    
        const testCharacter = {
            name: 'Test Char',
            traits: [{ trait_name: 'Compliments', is_positive: 1 }],
            difficulty: 2
        };
    
        UnlockedCharacters.selectRandomWithTraits.mockResolvedValue([
            testCharacter,
            {}, {}, {}, {}
        ]);
    
        const game = await Game.init(req, res);
    
        game.characters = [{
            character: testCharacter,
            health: 50,
            interactionlessRounds: 0,
            incrementHealth(increment) {
                this.health = Math.min(this.health + increment, 100);
            },
            decrementHealth(decrement) {
                this.health = Math.max(this.health - decrement, 0);
            }
        }];
    
        game.uniqueRandomItems = jest.fn().mockReturnValue(['Compliments', 'Food', 'Invite Out']);
    
        await game.playRound(req, res);
    
        expect(game.characters[0].health).toBe(55);
        expect(game.score).toBe(110);               
        expect(game.round).toBe(2);                 
    });
    

    test('ignoring a character decreases only their health by 5 and does not affect the score', async () => {
        const req = {
            session: { isAuth: true, accountID: 1 },
            body: {
                char_index: 0,
                action_index: 3 
            }
        };
        const res = {};
    
        const testCharacter = {
            name: 'TestChar',
            traits: [],
            difficulty: 1
        };
    
        UnlockedCharacters.selectRandomWithTraits.mockResolvedValue([
            testCharacter,
            {}, {}, {}, {}
        ]);
    
        const game = await Game.init(req, res);
    
        game.characters = [{
            character: testCharacter,
            health: 50,
            interactionlessRounds: 0,
            incrementHealth(amount) {
                this.health = Math.min(this.health + amount, 100);
            },
            decrementHealth(amount) {
                this.health = Math.max(this.health - amount, 0);
            }
        }];
    
        game.uniqueRandomItems = jest.fn().mockReturnValue(['Compliments', 'Food', 'Invite Out']);
    
        await game.playRound(req, res);
    
        expect(game.characters[0].health).toBe(45); 
        expect(game.score).toBe(100);              
    });

    test('character loses health by 2x the number of rounds they are not interacted with', async () => {
        const req = {
            session: { isAuth: true, accountID: 1 },
            body: {
                char_index: 0, 
                action_index: 0
            }
        };
        const res = {};
    
        const characterTraits = [{ trait_name: 'Compliments', is_positive: 1 }];
        const character0 = {
            name: 'Char 0',
            traits: characterTraits,
            difficulty: 1
        };
        const character1 = {
            name: 'Char 1',
            traits: [],
            difficulty: 1
        };
    
        UnlockedCharacters.selectRandomWithTraits.mockResolvedValue([
            character0, character1, {}, {}, {}
        ]);
    
        const game = await Game.init(req, res);
    
        game.characters = [0, 1].map(i => ({
            character: i === 0 ? character0 : character1,
            health: 50,
            interactionlessRounds: 0,
            incrementHealth(amount) {
                this.health = Math.min(this.health + amount, 100);
            },
            decrementHealth(amount) {
                this.health = Math.max(this.health - amount, 0);
            }
        }));
    
        game.uniqueRandomItems = jest.fn().mockReturnValue(['Compliments', 'Food', 'Invite Out']);
    
        for (let i = 0; i < 3; i++) {
            req.body.char_index = 0;
            req.body.action_index = 0;
            await game.playRound(req, res);
        }
    
        expect(game.characters[1].health).toBe(38);
    });
    
    
});