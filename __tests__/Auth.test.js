const { checkCredentials, addNewUser, isAuthenticated, isAdmin } = require('../architecture/controllers/auth');
const { Users, selectByEmail } = require('../architecture/models/Users');
const bcrypt = require('bcrypt');

jest.mock('express-mysql-session', () => {
    return () => { return class MockSessionStore {}; };
});
jest.mock('../architecture/models/Users', () => ({
    Users: {
        selectByUsername: jest.fn(),
        selectByEmail: jest.fn(),
        addUser: jest.fn(),
    }
}));
jest.mock('../architecture/models/UnlockedCharacters', () => ({
    UnlockedCharacters: {
        unlock: jest.fn()
    }
}));
jest.mock('bcrypt');

describe('Auth Controller', () => {
    
    let req;
    let res;
    
    beforeEach(() => {
        req = {
            session: {
                isAuth: true,
                accountID: 1,
                isAdmin: false,
            },
            body: {
                userid: 1,
                admin: 0,
                username: 'account1',
                password: 'password',
                password_repeat: 'password',
                email: 'account@account.com'
            },
        };
        res = { 
            json: jest.fn(),
            redirect: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        next = jest.fn();
        users = [
            {
                userid: 1,
                admin: 0,
                username: 'account1',
                password: 'password',
                email: 'account@account.com'
            }
        ]
    });

    //checkCredentials tests (5)
    test('checkCredentials for user', async () => {
        //creates mock data for SQL query
        Users.selectByUsername.mockResolvedValue(users);

        //bcrypt override so we don't have to worry about hashing passwords in tester code
        bcrypt.compare.mockResolvedValue(true);

        await checkCredentials(req, res);

        expect(req.session.isAuth).toBe(true);
        expect(req.session.accountID).toBe(1);
        expect(req.session.username).toBe('account1');
        expect(req.session.isAdmin).toBe(false);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            redirect: true
        }));
    });

    test('checkCredentials for admin', async () => {
        //sets the user to an admin
        users[0].admin = 1;

        //creates mock data for SQL query
        Users.selectByUsername.mockResolvedValue(users);

        //bcrypt override so we don't have to worry about hashing passwords in tester code
        bcrypt.compare.mockResolvedValue(true);

        await checkCredentials(req, res);

        expect(req.session.isAuth).toBe(true);
        expect(req.session.accountID).toBe(1);
        expect(req.session.username).toBe('account1');
        expect(req.session.isAdmin).toBe(true);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            redirect: true
        }));
    });

    test('checkCredentials when password does not match', async () => {
        //creates mock data for SQL query
        Users.selectByUsername.mockResolvedValue(users);

        //if this is set to false, then the passwords did not match
        bcrypt.compare.mockResolvedValue(false);

        await checkCredentials(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            alert: true,
            message: "Password is not correct."
        }));
    });

    test('checkCredentials when no user is found', async () => {
        //creates mock data for SQL query
        Users.selectByUsername.mockResolvedValue([]);

        await checkCredentials(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            alert: true,
            message: "User not found."
        }));
    });

    test('checkCredentials when more than one user is found', async () => {
        //adds a second user to the query
        users[1] = {
            userid: 2,
            admin: 0,
            username: 'account2',
            email: 'account2@account.com'
        }

        //creates mock data for SQL query
        Users.selectByUsername.mockResolvedValue(users);

        await checkCredentials(req, res);

        //if there is more than one user, we redirect back to the main page
        expect(res.redirect).toHaveBeenCalledWith('/');
    });

    //addNewUser tests (4)
    test('addNewUser success', async () => {
        //creates mock data for SQL query
        Users.selectByEmail.mockResolvedValue([]);
        Users.selectByUsername.mockResolvedValue([]);

        bcrypt.hash.mockResolvedValue('password');
        Users.addUser.mockResolvedValue({ insertId: 1 });

        await addNewUser(req, res);

        expect(req.session.isAuth).toBe(true);
        expect(req.session.accountID).toBe(1);
        expect(req.session.username).toBe('account1');
        expect(req.session.isAdmin).toBe(false);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            redirect: true
        }));
    });

    test('addNewUser fails when passwords do not match', async () => {
        //sets the repeat password so they don't match
        req.body.password_repeat = 'password_does_not_match'

        await addNewUser(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            alert: true,
            message: "Passwords do not match."
        }));
    });

    test('addNewUser fails because the username already exists', async () => {
        //sets the request to send data back with an existing account with that username
        Users.selectByUsername.mockResolvedValue(users);

        await addNewUser(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            alert: true,
            message: "Username already taken."
        }));
    });

    test('addNewUser fails because the email already exists', async () => {
        //sets the request to send data back with an existing account with that email
        Users.selectByEmail.mockResolvedValue(users);

        await addNewUser(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            alert: true,
            message: "Account with that email already exists."
        }));
    });

    //isAuthenicated tests (4)
    test('isAuthenticated works', () => {
        isAuthenticated(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    test('returns 401 if user is not authenticated', () => {
        // make user not authenticated
        req.session.isAuth = false; 

        isAuthenticated(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Authentication required' });
        expect(next).not.toHaveBeenCalled();
    });

    test('returns 401 if session does not exist', () => {
        //make it so there is no session
        req.session = null; 

        isAuthenticated(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Authentication required' });
        expect(next).not.toHaveBeenCalled();
    });

    test('returns 401 if accountID does not exist', () => {
        // they are missing an account ID
        req.session.accountID = null; 

        isAuthenticated(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Authentication required' });
        expect(next).not.toHaveBeenCalled();
    });

    //isAdmin tests (4)
    test('isAdmin works', () => {
        //currently in beforeEach they are not an admin, so we need to make the user an admin
        req.session.isAdmin = true;

        isAdmin(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    test('returns 403 if user is not admin', () => {
        // make user not authenticated
        req.session.isAuth = false; 
        req.session.isAdmin = true;

        isAdmin(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Admin access required' });
        expect(next).not.toHaveBeenCalled();
    });

    test('returns 403 if session does not exist', () => {
        //make it so there is no session
        req.session = null; 

        isAdmin(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Admin access required' });
        expect(next).not.toHaveBeenCalled();
    });

    test('returns 403 if accountID does not exist', () => {
        //currently in beforeEach they are not an admin, so if we run this it will fail
        isAdmin(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Admin access required' });
        expect(next).not.toHaveBeenCalled();
    });



    

})