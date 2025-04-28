const { getHighScores, getAllScores, deleteScore } = require('../architecture/controllers/leaderboard');
const { Games } = require('../architecture/models/Games');
const { Users } = require('../architecture/models/Users');


jest.mock('express-mysql-session', () => {
    return () => { return class MockSessionStore {}; };
});
jest.mock('../architecture/models/Users');
jest.mock('../architecture/models/Games');

describe('Leaderboard Controller', () => {

    let req;
    let res;
    let mockScores;

    beforeEach(() => {
        req = {
            session: {
                isAuth: true,
                accountID: 1,
            },
            body: {},
            query: {
                cateogry: 'score',
            }
        };
        res = {
            render: jest.fn(),
            json: jest.fn(),
            status: jest.fn(() => res),
        };
        mockScores = [
            { userid: 1, topscore: 100 },
            { userid: 2, topscore: 90 },
            { userid: 3, topscore: 80 },
            { userid: 4, topscore: 70 },
            { userid: 5, topscore: 60 },
            { userid: 6, topscore: 50 }
        ];
        Users.selectByID = jest.fn();
        Users.selectByID.mockResolvedValue([]);
        Games.removeGame = jest.fn();
    });
    
    test('if the user is not authenticated we only grab the top 5 scores', async () => {
        // the user is not authenticated in this case
        req.session.isAuth = false;
        
        Games.selectTopScores.mockResolvedValue(mockScores);

        await getHighScores(req, res);

        expect(res.render).toHaveBeenCalledWith('pages/leaderboard', {
            scoresArr: [
                [1, { userid: 1, topscore: 100 }],
                [2, { userid: 2, topscore: 90 }],
                [3, { userid: 3, topscore: 80 }],
                [4, { userid: 4, topscore: 70 }],
                [5, { userid: 5, topscore: 60 }]
            ],
            moneyArr: [],
            activeCategory: 'score',
            isAdmin: false
        });
    });

    test('if the user is authenticated and their score is in the top 5, we only grab the top 5 scores', async () => {
        Games.selectTopScores.mockResolvedValue(mockScores);

        await getHighScores(req, res);

        expect(res.render).toHaveBeenCalledWith('pages/leaderboard', {
            scoresArr: [
                [1, { userid: 1, topscore: 100 }],
                [2, { userid: 2, topscore: 90 }],
                [3, { userid: 3, topscore: 80 }],
                [4, { userid: 4, topscore: 70 }],
                [5, { userid: 5, topscore: 60 }]
            ],
            moneyArr: [],
            activeCategory: 'score',
            isAdmin: false
        });
    });

    test('if the user is authenticated and their score is not in the top 5, we grab the top 5 scores and that users score', async () => {
        // set the user to score outside of the top 5
        req.session.accountID = 6;

        Games.selectTopScores.mockResolvedValue(mockScores);

        await getHighScores(req, res);

        expect(res.render).toHaveBeenCalledWith('pages/leaderboard', {
            scoresArr: [
                [1, { userid: 1, topscore: 100 }],
                [2, { userid: 2, topscore: 90 }],
                [3, { userid: 3, topscore: 80 }],
                [4, { userid: 4, topscore: 70 }],
                [5, { userid: 5, topscore: 60 }],
                [6, { userid: 6, topscore: 50}],
            ],
            moneyArr: [],
            activeCategory: 'score',
            isAdmin: false
        });
    });

    test('if a user has multiple scores in the top 5 they are both displayed', async () => {
        // adds a second score by accountID = 1
        mockScores[1] = { userid: 1, topscore: 90 },

        Games.selectTopScores.mockResolvedValue(mockScores);

        await getHighScores(req, res);

        expect(res.render).toHaveBeenCalledWith('pages/leaderboard', {
            scoresArr: [
                [1, { userid: 1, topscore: 100 }],
                [2, { userid: 1, topscore: 90 }],
                [3, { userid: 3, topscore: 80 }],
                [4, { userid: 4, topscore: 70 }],
                [5, { userid: 5, topscore: 60 }],
            ],
            moneyArr: [],
            activeCategory: 'score',
            isAdmin: false
        });
    });

    test('if their are no scores, the page still renders', async () => {
        // set mock scores equal to the empty list
        mockScores = [];

        Games.selectTopScores.mockResolvedValue(mockScores);

        await getHighScores(req, res);

        expect(res.render).toHaveBeenCalledWith('pages/leaderboard', {
            scoresArr: [],
            moneyArr: [],
            activeCategory: 'score',
            isAdmin: false
        });
    });

    // getAllScores tests (2)
    test('getAllScores retrieves all scores and sends them in JSON', async () => {
        Games.selectTopScores.mockResolvedValue(mockScores);

        await getAllScores(req, res);

        expect(Games.selectTopScores).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(mockScores);
    });

    test('getAllScores handles errors', async () => {
        Games.selectTopScores.mockRejectedValue(new Error('Database error'));

        await getAllScores(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch scores' });
    });

    //deleteScore tests (2)
    test('deleteScore deletes a score and returns success confirmation', async () => {
        req.params = { id: '10' };
        Games.removeGame.mockResolvedValue({ affectedRows: 1 });

        await deleteScore(req, res);

        expect(Games.removeGame).toHaveBeenCalledWith('10');
        expect(res.json).toHaveBeenCalledWith({ success: true, deletedId: '10' });
    });

    test('deleteScore handles errors', async () => {
        req.params = { id: '10' };
        Games.removeGame.mockRejectedValue(new Error('Database error'));

        await deleteScore(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Failed to delete score' });
    });

})