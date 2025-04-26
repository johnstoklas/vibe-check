const { getHighScores } = require('../architecture/controllers/leaderboard');
const { Games } = require('../architecture/models/Games');


jest.mock('express-mysql-session', () => {
    return () => { return class MockSessionStore {}; };
});
jest.mock('../architecture/models/Games');

describe('Leaderboard', () => {

    let req;
    let res;
    let mockScores;

    beforeEach(() => {
        req = {
            session: {
                isAuth: true,
                accountID: 1,
                isGameRunning: false
            },
            body: {}
        };
        res = {
            render: jest.fn()
        };
        mockScores = [
            { userid: 1, topscore: 100 },
            { userid: 2, topscore: 90 },
            { userid: 3, topscore: 80 },
            { userid: 4, topscore: 70 },
            { userid: 5, topscore: 60 },
            { userid: 6, topscore: 50 }
        ];
    });
    
    test('if the user is not authenticated we only grab the top 5 scores', async () => {
        // the user is not authenticated in this case
        req.session.isAuth = false;
        
        Games.selectTopScores.mockResolvedValue(mockScores);

        await getHighScores(req, res);

        expect(res.render).toHaveBeenCalledWith('pages/leaderboard', {
            gamesArr: [
                [1, { userid: 1, topscore: 100 }],
                [2, { userid: 2, topscore: 90 }],
                [3, { userid: 3, topscore: 80 }],
                [4, { userid: 4, topscore: 70 }],
                [5, { userid: 5, topscore: 60 }]
            ]
        });
    });

    test('if the user is authenticated and their score is in the top 5, we only grab the top 5 scores', async () => {
        Games.selectTopScores.mockResolvedValue(mockScores);

        await getHighScores(req, res);

        expect(res.render).toHaveBeenCalledWith('pages/leaderboard', {
            gamesArr: [
                [1, { userid: 1, topscore: 100 }],
                [2, { userid: 2, topscore: 90 }],
                [3, { userid: 3, topscore: 80 }],
                [4, { userid: 4, topscore: 70 }],
                [5, { userid: 5, topscore: 60 }]
            ]
        });
    });

    test('if the user is authenticated and their score is not in the top 5, we grab the top 5 scores and that users score', async () => {
        // set the user to score outside of the top 5
        req.session.accountID = 6;

        Games.selectTopScores.mockResolvedValue(mockScores);

        await getHighScores(req, res);

        expect(res.render).toHaveBeenCalledWith('pages/leaderboard', {
            gamesArr: [
                [1, { userid: 1, topscore: 100 }],
                [2, { userid: 2, topscore: 90 }],
                [3, { userid: 3, topscore: 80 }],
                [4, { userid: 4, topscore: 70 }],
                [5, { userid: 5, topscore: 60 }],
                [6, { userid: 6, topscore: 50}],
            ]
        });
    });

    test('if a user has multiple scores in the top 5 they are both displayed', async () => {
        // adds a second score by accountID = 1
        mockScores[1] = { userid: 1, topscore: 90 },

        Games.selectTopScores.mockResolvedValue(mockScores);

        await getHighScores(req, res);

        expect(res.render).toHaveBeenCalledWith('pages/leaderboard', {
            gamesArr: [
                [1, { userid: 1, topscore: 100 }],
                [2, { userid: 1, topscore: 90 }],
                [3, { userid: 3, topscore: 80 }],
                [4, { userid: 4, topscore: 70 }],
                [5, { userid: 5, topscore: 60 }],
            ]
        });
    });

    test('if their are no scores, the page still renders', async () => {
        // set mock scores equal to the empty list
        mockScores = [];

        Games.selectTopScores.mockResolvedValue(mockScores);

        await getHighScores(req, res);

        expect(res.render).toHaveBeenCalledWith('pages/leaderboard', {
            gamesArr: []
        });
    });

})