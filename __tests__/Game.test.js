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

    test('health is capped at 100 and floored at 0', async () => {
        const req = {
            session: { isAuth: true, accountID: 1 },
            body: { char_index: 0, action_index: 0 }
        };
        const res = {};
    
        const testCharacter = {
            name: 'OverflowChar',
            traits: [{ trait_name: 'Compliments', is_positive: 1 }],
            difficulty: 10 
        };
    
        UnlockedCharacters.selectRandomWithTraits.mockResolvedValue([testCharacter, {}, {}, {}, {}]);
    
        const game = await Game.init(req, res);
    
        game.characters = [{
            character: testCharacter,
            health: 98,
            interactionlessRounds: 0,
            incrementHealth(amount) {
                this.health = Math.min(this.health + amount, 100);
            },
            decrementHealth(amount) {
                this.health = Math.max(this.health - amount, 0);
            }
        }];
    
        game.uniqueRandomItems = jest.fn().mockReturnValue(['Compliments', 'Invite Out', 'Food']);
    
        await game.playRound(req, res);
    
        expect(game.characters[0].health).toBe(100); 
    
        req.body.action_index = 1; 
        game.characters[0].decrementHealth(200);
    
        expect(game.characters[0].health).toBe(0); 
    });

    // playRound logic
    test('playRound changes character health and player score (positive)', async () => {
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

    test('playRound changes character health and player score (negative)', async () => {
        const req = {
            session: { isAuth: true, accountID: 1 },
            body: { char_index: 0, action_index: 0 }
        };
        const res = {};
    
        const testCharacter = {
            name: 'NegativeChar',
            traits: [{ trait_name: 'Compliments', is_positive: 0 }],
            difficulty: 2
        };
    
        UnlockedCharacters.selectRandomWithTraits.mockResolvedValue([testCharacter, {}, {}, {}, {}]);
    
        const game = await Game.init(req, res);
    
        game.characters = [{
            character: testCharacter,
            health: 50,
            interactionlessRounds: 0,
            incrementHealth(amount) { this.health = Math.min(this.health + amount, 100); },
            decrementHealth(amount) { this.health = Math.max(this.health - amount, 0); }
        }];
    
        game.uniqueRandomItems = jest.fn().mockReturnValue(['Compliments', 'Food', 'Invite Out']);
    
        await game.playRound(req, res);
    
        expect(game.characters[0].health).toBe(40); 
        expect(game.score).toBe(90);               
    });

    test('playRound changes character health and player score (neutral)', async () => {
        const req = {
            session: { isAuth: true, accountID: 1 },
            body: { char_index: 0, action_index: 0 }
        };
        const res = {};
    
        const testCharacter = {
            name: 'NeutralChar',
            traits: [{ trait_name: 'Invite Out', is_positive: 1 }],
            difficulty: 2
        };
    
        UnlockedCharacters.selectRandomWithTraits.mockResolvedValue([testCharacter, {}, {}, {}, {}]);
    
        const game = await Game.init(req, res);
    
        game.characters = [{
            character: testCharacter,
            health: 50,
            interactionlessRounds: 0,
            incrementHealth(amount) { this.health = Math.min(this.health + amount, 100); },
            decrementHealth(amount) { this.health = Math.max(this.health - amount, 0); }
        }];
    
        game.uniqueRandomItems = jest.fn().mockReturnValue(['Compliments', 'Food', 'Surprise']);
    
        await game.playRound(req, res);
    
        expect(game.characters[0].health).toBe(50); 
        expect(game.score).toBe(100);              
    });

    // ignore logic
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

    test('interaction resets interactionlessRounds to 0', async () => {
        const req = {
            session: { isAuth: true, accountID: 1 },
            body: { char_index: 0, action_index: 0 }
        };
        const res = {};
    
        const testCharacter = {
            name: 'ForgetMeNot',
            traits: [{ trait_name: 'Compliments', is_positive: 1 }],
            difficulty: 1
        };
    
        UnlockedCharacters.selectRandomWithTraits.mockResolvedValue([testCharacter, {}, {}, {}, {}]);
    
        const game = await Game.init(req, res);
    
        game.characters = [{
            character: testCharacter,
            health: 50,
            interactionlessRounds: 2, 
            incrementHealth(amount) { this.health = Math.min(this.health + amount, 100); },
            decrementHealth(amount) { this.health = Math.max(this.health - amount, 0); }
        }];
    
        game.uniqueRandomItems = jest.fn().mockReturnValue(['Compliments', 'Invite Out', 'Food']);
    
        await game.playRound(req, res);
    
        expect(game.characters[0].interactionlessRounds).toBe(0); 
    });

    // end game logic
    test('if a characters health is at 0, the game is lost', async () => {
        const req = {
            session: { isAuth: true, accountID: 1 },
            body: { char_index: 0, action_index: 0 }
        };
        const res = {};
    
        const testCharacter = {
            name: 'AboutToLose',
            traits: [{ trait_name: 'Compliments', is_positive: 0 }],
            difficulty: 1
        };
    
        UnlockedCharacters.selectRandomWithTraits.mockResolvedValue([
            testCharacter, {}, {}, {}, {}
        ]);
    
        const game = await Game.init(req, res);
    
        game.characters = [{
            character: testCharacter,
            health: 10,
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
    
        expect(game.characters[0].health).toBe(0);       
        expect(game.hasEnded).toBe(true);                
    });    

    test('round does not increase if game has ended', async () => {
        const req = {
            session: { isAuth: true, accountID: 1 },
            body: { char_index: 0, action_index: 0 }
        };
        const res = {};
    
        const testCharacter = {
            name: 'EndChar',
            traits: [{ trait_name: 'Compliments', is_positive: 0 }],
            difficulty: 1
        };
    
        UnlockedCharacters.selectRandomWithTraits.mockResolvedValue([testCharacter, {}, {}, {}, {}]);
    
        const game = await Game.init(req, res);
    
        game.characters = [{
            character: testCharacter,
            health: 10,
            interactionlessRounds: 0,
            incrementHealth(amount) { this.health = Math.min(this.health + amount, 100); },
            decrementHealth(amount) { this.health = Math.max(this.health - amount, 0); }
        }];
    
        game.uniqueRandomItems = jest.fn().mockReturnValue(['Compliments', 'Invite Out', 'Food']);
    
        await game.playRound(req, res);
    
        expect(game.hasEnded).toBe(true);  
        expect(game.round).toBe(1);        
    });

    test('game ends if any character reaches 0 health, not just the one being interacted with', async () => {
        const req = {
            session: { isAuth: true, accountID: 1 },
            body: { char_index: 0, action_index: 0 }
        };
        const res = {};
    
        const mainChar = {
            name: 'SafeChar',
            traits: [{ trait_name: 'Compliments', is_positive: 1 }],
            difficulty: 1
        };
        const ignoredChar = {
            name: 'ForgottenChar',
            traits: [],
            difficulty: 1
        };
    
        UnlockedCharacters.selectRandomWithTraits.mockResolvedValue([mainChar, ignoredChar, {}, {}, {}]);
    
        const game = await Game.init(req, res);
    
        game.characters = [
            {
                character: mainChar,
                health: 50,
                interactionlessRounds: 0,
                incrementHealth(amount) { this.health = Math.min(this.health + amount, 100); },
                decrementHealth(amount) { this.health = Math.max(this.health - amount, 0); }
            },
            {
                character: ignoredChar,
                health: 3, 
                interactionlessRounds: 1,
                incrementHealth(amount) { this.health = Math.min(this.health + amount, 100); },
                decrementHealth(amount) { this.health = Math.max(this.health - amount, 0); }
            }
        ];
    
        game.uniqueRandomItems = jest.fn().mockReturnValue(['Compliments', 'Invite Out', 'Food']);
    
        await game.playRound(req, res);
    
        expect(game.characters[1].health).toBe(0);    
        expect(game.hasEnded).toBe(true);              
    });

    test('playRound should not update score or health if game has already ended', async () => {
        const req = {
            session: { isAuth: true, accountID: 1 },
            body: { char_index: 0, action_index: 0 }
        };
        const res = {};
    
        const testCharacter = {
            name: 'PostGameChar',
            traits: [{ trait_name: 'Compliments', is_positive: 1 }],
            difficulty: 1
        };
    
        UnlockedCharacters.selectRandomWithTraits.mockResolvedValue([testCharacter, {}, {}, {}, {}]);
    
        const game = await Game.init(req, res);
    
        game.characters = [{
            character: testCharacter,
            health: 0, 
            interactionlessRounds: 0,
            incrementHealth(amount) { this.health = Math.min(this.health + amount, 100); },
            decrementHealth(amount) { this.health = Math.max(this.health - amount, 0); }
        }];
    
        game.hasEnded = true; 
    
        game.uniqueRandomItems = jest.fn().mockReturnValue(['Compliments', 'Food', 'Invite Out']);
    
        await game.playRound(req, res);
    
        expect(game.characters[0].health).toBe(0); 
        expect(game.score).toBe(100);              
        expect(game.round).toBe(1);                
    });
});