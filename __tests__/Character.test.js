const { getAllCharacters, getAllTraits, getCharactersByTrait, getUnlockedCharacters } = require('../architecture/controllers/character');
const { Characters } = require('../architecture/models/Characters');
const { UnlockedCharacters } = require('../architecture/models/UnlockedCharacters');

jest.mock('express-mysql-session', () => {
    return () => { return class MockSessionStore {}; };
});
jest.mock('../architecture/models/Characters', () => ({
    Characters: {
        selectAllWithTraits: jest.fn(),
        selectByTrait: jest.fn(),
    }
}));
jest.mock('../architecture/models/UnlockedCharacters', () => ({
    UnlockedCharacters: {
        selectAllWithTraits: jest.fn()
    }
}));

describe('Character Controller', () => {

    let req;
    let res;
    let characters;

    beforeEach(() => {
        req = {
            session: {
                isAuth: true,
                accountID: 1,
            },
            body: {},
        };
        res = { json: jest.fn() };

        characters =  [
            { name: 'Character1', traits: "(Compliments, 1),(Food, 0),(Getting Drive, 1)", difficulty: 1},
            { name: 'Character2', traits: "(Compliments, 1),(Food, 0),(Getting Drive, 1)", difficulty: 1},
            { name: 'Character3', traits: "(Compliments, 1),(Food, 0),(Getting Drive, 1)", difficulty: 1},
            { name: 'Character4', traits: "(Compliments, 1),(Food, 0),(Getting Drive, 1)", difficulty: 1},
        ];

        traits = [
            "Compliments",
            "Food",
            "Getting Drive"
        ]
    });

    test('getAllCharacter', async () => {
        Characters.selectAllWithTraits.mockResolvedValue(characters);

        await getAllCharacters(req, res);

        expect(res.json).toHaveBeenCalledWith({
            data: characters.map(char => ({
                ...char,
                traits: char.traits ? char.traits.split(',') : []
              }))
        })
    });

    test('getAllCharacters throws error', async () => {
        Characters.selectAllWithTraits.mockRejectedValue(new Error('Database error'));
    
        await expect(getAllCharacters(req, res))
            .rejects
            .toThrow('Failed to fetch characters');
    });

    test('getCharactersByTrait', async () => {
        req.params = { traitID: 1 }

        Characters.selectByTrait.mockResolvedValue(characters);

        await getCharactersByTrait(req, res);

        expect(res.json).toHaveBeenCalledWith({
            data: characters.map(char => ({
                ...char,
                traits: char.traits ? char.traits.split(',') : []
            }))
        })
    });

    test('getCharactersByTrait throws error when database fails', async () => {
        req.params = { traitID: 1 };
        Characters.selectByTrait.mockRejectedValue(new Error('Database error'));
    
        await expect(getCharactersByTrait(req, res))
            .rejects
            .toThrow('Failed to fetch characters by trait');
    });
    

    test('getUnlockedCharacters', async () => {
        UnlockedCharacters.selectAllWithTraits.mockResolvedValue(characters);

        await getUnlockedCharacters(req, res);

        expect(res.json).toHaveBeenCalledWith({
            data: characters.map(char => ({
                ...char,
                traits: char.traits ? char.traits.split(',') : []
            }))
        })
    });

    test('getUnlockedCharacters throws error when database fails', async () => {
        UnlockedCharacters.selectAllWithTraits.mockRejectedValue(new Error('Database error'));
    
        await expect(getUnlockedCharacters(req, res))
            .rejects
            .toThrow('Failed to fetch unlocked characters');
    });
    

    test('getUnlockedCharacters throws error if user is not authenticated', async () => {
        // sets the auth to false
        req.session.isAuth = false;

        UnlockedCharacters.selectAllWithTraits.mockResolvedValue(characters);

        await expect(getUnlockedCharacters(req, res))
            .rejects
            .toThrow('User not authenticated');
    });

})