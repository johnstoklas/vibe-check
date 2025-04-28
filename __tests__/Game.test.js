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

describe('Game Controller', () => {

    let req;
    let randomActions;
    let testCharacter;
    let ws;
    let state;

    // initializes the game with controlled variables so we know what is happening on each round
    beforeEach(() => {
        req = {
            session: {
                isAuth: true,
                accountID: 1,
                isGameRunning: false
            },
            body: {}
        };

        testCharacter = {
            name: 'Character',
            traits: "(Compliments, 1),(Food, 0),(Getting Drive, 1)",
            difficulty: 1,
            health: 50
        };

        randomActions = [
            { name: 'Compliments', cost: 0 }, // positive action for testCharacter
            { name: 'Food', cost: 15 }, // negative action for testCharacter
            { name: 'Invite Out', cost: 0 } // neutral action for testCharacter
        ];

        ws = { send: jest.fn(), on: jest.fn() };

        state = {
            char_index: 0,
            action_index: null,
            was_ignored: false,
            previous_char_index: null,
        };
        
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

        const ws = { send: jest.fn(), on: jest.fn() };
        
        const game = await Game.init(ws, req);

        expect(game.characters.length).toBe(5);
        expect(game.score).toBe(0);
        expect(game.money).toBe(50);
        expect(game.round).toBe(1);
        expect(req.session.isGameRunning).toBe(true);
    });
    
    // makes sure score cannot go above 100 or below 0
    test('health is capped at 100', async () => {
        UnlockedCharacters.selectRandomWithTraits.mockResolvedValue([testCharacter, {}, {}, {}, {}]);
    
        const game = await Game.init(ws, req);

        game.uniqueRandomItems = jest.fn().mockReturnValue(randomActions);

        game.characters[0].health = 98; // sets character health really high

        state.action_index = -1;
        await game.runRound(ws, state); 

        state.action_index = 0;
        state.previous_char_index = 0;
        await game.runRound(ws, state)

        expect(game.characters[0].health).toBe(100); 
    });

    test('health is floored at 0', async () => {
        UnlockedCharacters.selectRandomWithTraits.mockResolvedValue([testCharacter, {}, {}, {}, {}]);
    
        const game = await Game.init(ws, req);

        game.uniqueRandomItems = jest.fn().mockReturnValue(randomActions);


        game.characters[0].health = 3; // sets character health really low

        state.action_index = -1;
        await game.runRound(ws, state);
        
        state.action_index = 1;
        state.previous_char_index = 0;
        await game.runRound(ws, state)

        expect(game.characters[0].health).toBe(0); 
    });

    // playRound logic for positive, negative, and neutral
    test('playRound changes character health and player score (positive)', async () => {
        UnlockedCharacters.selectRandomWithTraits.mockResolvedValue([testCharacter, {}, {}, {}, {}]);
    
        const game = await Game.init(ws, req);

        game.uniqueRandomItems = jest.fn().mockReturnValue(randomActions);

        game.characters[0].character.difficulty = 2;

        state.action_index = -1;
        await game.runRound(ws, state);
        
        state.action_index = 0; // sets action to positive action
        state.previous_char_index = 0;
        await game.runRound(ws, state)

        expect(game.characters[0].health).toBe(55); 
        expect(game.score).toBe(10);
    });

    test('playRound changes character health and player score (negative)', async () => {
        UnlockedCharacters.selectRandomWithTraits.mockResolvedValue([testCharacter, {}, {}, {}, {}]);
    
        const game = await Game.init(ws, req);

        game.uniqueRandomItems = jest.fn().mockReturnValue(randomActions);


        game.characters[0].character.difficulty = 2;

        state.action_index = -1;
        await game.runRound(ws, state);
        
        state.action_index = 1; // sets action to negative
        state.previous_char_index = 0;
        await game.runRound(ws, state)

        expect(game.characters[0].health).toBe(40); 
        expect(game.score).toBe(-10);         
    });

    test('playRound changes character health and player score (neutral)', async () => {
        UnlockedCharacters.selectRandomWithTraits.mockResolvedValue([testCharacter, {}, {}, {}, {}]);
    
        const game = await Game.init(ws, req);

        game.uniqueRandomItems = jest.fn().mockReturnValue(randomActions);


        game.characters[0].difficulty = 2;

        state.action_index = -1;
        await game.runRound(ws, state);
        
        state.action_index = 2; // sets the action type to neutral
        state.previous_char_index = 0;
        await game.runRound(ws, state)

        expect(game.characters[0].health).toBe(50); 
        expect(game.score).toBe(0);             
    });

    // money logic
    test('if action costs money, the users money is lowered accordingly', async () => {
        UnlockedCharacters.selectRandomWithTraits.mockResolvedValue([testCharacter, {}, {}, {}, {}]);
    
        const game = await Game.init(ws, req);

        game.uniqueRandomItems = jest.fn().mockReturnValue(randomActions);

        state.action_index = -1;
        await game.runRound(ws, state);
        
        state.action_index = 1; // this action costs money 
        state.previous_char_index = 0;
        await game.runRound(ws, state)

        expect(game.money).toBe(35)
    });   
    
    test('if a characters action costs money but their score goes over 70, 80, or 90 the money goes up as well', async () => {
        UnlockedCharacters.selectRandomWithTraits.mockResolvedValue([testCharacter, {}, {}, {}, {}]);
    
        const game = await Game.init(ws, req);

        game.uniqueRandomItems = jest.fn().mockReturnValue(randomActions);

        game.characters[0].character.traits = "(Compliments, 1),(Food, 1),(Getting Drive, 1)"; // makes food be a positive trait
        game.characters[0].health = 68; // sets the health so that when you give the character food, the score goes up but also they give you money

        state.action_index = -1;
        await game.runRound(ws, state);
        
        state.action_index = 1; // this action costs money 
        state.previous_char_index = 0;
        await game.runRound(ws, state)

        expect(game.money).toBe(36)
    });  
    
    test('if a characters action costs money and the player does not have enough money, they cannot pay for the action', async () => {
        UnlockedCharacters.selectRandomWithTraits.mockResolvedValue([testCharacter, {}, {}, {}, {}]);
    
        const game = await Game.init(ws, req);

        game.uniqueRandomItems = jest.fn().mockReturnValue(randomActions);

        game.money = 10; // food costs 15 dollars so the player wont have enough

        state.action_index = -1;
        await game.runRound(ws, state);
        
        state.action_index = 1; // this action costs money 
        state.previous_char_index = 0;
        await game.runRound(ws, state)

        expect(game.money).toBe(10);
        expect(game.score).toBe(0);
        expect(game.characters[0].health).toBe(50);
    });  
    
    // ignore logic
    test('ignoring a character decreases only their health by 5 and does not affect the score', async () => {
        UnlockedCharacters.selectRandomWithTraits.mockResolvedValue([testCharacter, {}, {}, {}, {}]);
    
        const game = await Game.init(ws, req);

        game.uniqueRandomItems = jest.fn().mockReturnValue(randomActions);

        state.action_index = -1;
        await game.runRound(ws, state);

        state.was_ignored = true;
        
        state.previous_char_index = 0;
        await game.runRound(ws, state)

        expect(game.characters[0].health).toBe(45);    
    });

    test('character loses health by 2x the number of rounds they are not interacted with', async () => {
        UnlockedCharacters.selectRandomWithTraits.mockResolvedValue([testCharacter, testCharacter, testCharacter, testCharacter, testCharacter]);
    
        const game = await Game.init(ws, req);

        game.uniqueRandomItems = jest.fn().mockReturnValue(randomActions);

        game.characters[1].health = 30;
        game.characters[1].interactionlessRounds = 1;

        game.characters[2].health = 80;
        game.characters[2].interactionlessRounds = 2;

        game.characters[3].health = 42;
        game.characters[3].interactionlessRounds = 3;

        game.characters[4].health = 16;
        game.characters[4].interactionlessRounds = 4;

        state.action_index = -1;
        await game.runRound(ws, state);

        state.action_index = 0;
        state.previous_char_index = 0;
        await game.runRound(ws, state)

        expect(game.characters[0].health).toBe(55);  
        expect(game.characters[1].health).toBe(29);    
        expect(game.characters[2].health).toBe(78);    
        expect(game.characters[3].health).toBe(39);    
        expect(game.characters[4].health).toBe(12);    
    });

    test('interaction resets interactionlessRounds to 0', async () => {
        UnlockedCharacters.selectRandomWithTraits.mockResolvedValue([testCharacter, {}, {}, {}, {}]);
    
        const game = await Game.init(ws, req);

        game.uniqueRandomItems = jest.fn().mockReturnValue(randomActions);

        game.characters[0].interactionlessRounds = 5;

        state.action_index = -1;
        await game.runRound(ws, state);

        state.action_index = 0;
        state.previous_char_index = 0;
        await game.runRound(ws, state)

        expect(game.characters[0].health).toBe(55);
        expect(game.characters[0].interactionlessRounds).toBe(0);    
    });

    // end game logic
    test('if a characters health is at 0, the game is lost', async () => {   
        UnlockedCharacters.selectRandomWithTraits.mockResolvedValue([testCharacter, {}, {}, {}, {}]);
    
        const game = await Game.init(ws, req);

        expect(game.hasEnded).toBe(false);       

        game.uniqueRandomItems = jest.fn().mockReturnValue(randomActions);

        game.characters[0].health = 5;

        state.action_index = -1;
        await game.runRound(ws, state);

        state.action_index = 1; // action that will decrease health
        state.previous_char_index = 0;
        await game.runRound(ws, state)

        expect(game.characters[0].health).toBe(0);
        expect(game.hasEnded).toBe(true);       
    });    

    test('game ends if any character reaches 0 health, not just the one being interacted with', async () => {
        UnlockedCharacters.selectRandomWithTraits.mockResolvedValue([testCharacter, testCharacter, {}, {}, {}]);
    
        const game = await Game.init(ws, req);

        expect(game.hasEnded).toBe(false);       

        game.uniqueRandomItems = jest.fn().mockReturnValue(randomActions);

        game.characters[0].health = 5;
        game.characters[1].health = 5;
        game.characters[1].interactionlessRounds = 10; // lowes character 2's health to 0 as well

        state.action_index = -1;
        await game.runRound(ws, state);

        state.action_index = 1; // action that will decrease health
        state.previous_char_index = 0;
        await game.runRound(ws, state)

        expect(game.characters[0].health).toBe(0);
        expect(game.characters[1].health).toBe(0);
        expect(game.hasEnded).toBe(true);    
    });

    test('handleGameOver unlocks characters based on score, money, and games played', async () => {
        UnlockedCharacters.selectRandomWithTraits.mockResolvedValue([testCharacter, {}, {}, {}, {}]);
        
        const game = await Game.init(ws, req);
    
        game.score = 30; // we should unlock character 9
    
        await game.handleGameOver(ws);
    
        // Check the unlock function is called with the expected character IDs
        expect(UnlockedCharacters.unlock.mock.calls).toEqual(
            expect.arrayContaining([
              [1, 9],
            ])
          );
    
        expect(ws.send).toHaveBeenCalledWith(expect.stringContaining('"type":"end"'));
    
        expect(game.hasEnded).toBe(true);
    });
    
    test('handleGameOver unlocks final character if conditions met', async () => {
        UnlockedCharacters.selectRandomWithTraits.mockResolvedValue([testCharacter, {}, {}, {}, {}]);
        
        const game = await Game.init(ws, req);
    
        game.score = 105;
        game.money = 105;
    
        const gamesModel = require('../architecture/models/Games');
        gamesModel.checkGamesPlayed = jest.fn().mockResolvedValue(5);
    
        await game.handleGameOver(ws);
    
        expect(UnlockedCharacters.unlock).toHaveBeenCalledWith(1, 20); // final unlock for 100+ score and 100+ money
        expect(game.hasEnded).toBe(true);
    });
    
});
