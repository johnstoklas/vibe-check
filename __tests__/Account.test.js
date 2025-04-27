const e = require('express');
const { gatherAccountData, changeUsername, changeEmail, changePassword, logOut, deleteAccount } = require('../architecture/controllers/account');
const { Users } = require('../architecture/models/Users');
const { fetchRedirect, fetchAlertRedirect } = require('../architecture/utility');
const bcrypt = require('bcrypt');

jest.mock('express-mysql-session', () => {
    return () => { return class MockSessionStore {}; };
});
jest.mock('../architecture/models/Users', () => ({
    Users: {
        selectByID: jest.fn(),
        selectByUsername: jest.fn(),
        updateUsername: jest.fn(),
        selectByEmail: jest.fn(),
        updateEmail: jest.fn(),
        updatePassword: jest.fn(),
        deleteUser: jest.fn(),
    }
}));
jest.mock('../architecture/utility', () => ({
    fetchRedirect: jest.fn(),
    fetchAlertRedirect: jest.fn(),
}));
jest.mock('bcrypt');

describe('Account Controller', () => {

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
                password_old: 'password_old',
                password_new: 'password_new',
                password_new_repeat: 'password_new',
                email: 'account@account.com'
            },
        };
        res = { 
            json: jest.fn(),
            redirect: jest.fn(),
            status: jest.fn().mockReturnThis(),
            render: jest.fn()
        };
        users = [
            {
                userid: 1,
                admin: 0,
                username: 'account1',
                password: 'password_old',
                email: 'account@account.com'
            }
        ]
    });

    //gatherAccountData test (3)
    test('gatherAccountData success', async() => {
        Users.selectByID.mockResolvedValue([users[0]]);

        await gatherAccountData(req, res);

        expect(Users.selectByID).toHaveBeenCalledWith(1);
        expect(res.render).toHaveBeenCalledWith('pages/account', { 
            username: 'account1', 
            email: 'account@account.com' 
        });
    });

    test('gatherAccountData fails when a user is not authenticated', async() => {
        //sets isAuth to false
        req.session.isAuth = false;
        Users.selectByID.mockResolvedValue([users[0]]);

        await gatherAccountData(req, res);

        expect(fetchAlertRedirect).toHaveBeenCalledWith(
            req,
            res,
            "Authentication is required to access the account page."
        );
    });

    test('gatherAccountData fails when more than one user is queried', async() => {
        //add another value to users so that the query has two things
        users[1] = "extra data";
        Users.selectByID.mockResolvedValue(users);

        await gatherAccountData(req, res);

        // we redirect back to the main page if an error like this happens
        expect(res.redirect).toHaveBeenCalledWith('/');
    });

    // changeUsername tests (2)
    test('changeUsername works', async() => {
        //nobody has this username currently
        Users.selectByUsername.mockResolvedValue([])
        Users.updateUsername.mockResolvedValue();

        await changeUsername(req, res);

        expect(Users.selectByUsername).toHaveBeenCalledWith('account1');
        expect(Users.updateUsername).toHaveBeenCalledWith(1, 'account1');

        expect(fetchRedirect).toHaveBeenCalledWith(
            req,
            res,
            'Successful change username.',
            '/account'
        );
    });

    test('changeUsername fails when the username is already taken', async() => {
        // if we set the query to this, the username will already exist and an error will be thrown
        Users.selectByUsername.mockResolvedValue(users);

        await changeUsername(req, res);

        expect(fetchAlertRedirect).toHaveBeenCalledWith(
            req,
            res,
            "Username already taken."
        );
    });

    // changeEmail tests (2)
    test('changeEmail works', async() => {
        //no account has this email currently
        Users.selectByEmail.mockResolvedValue([])
        Users.updateEmail.mockResolvedValue();

        await changeEmail(req, res);

        expect(Users.selectByEmail).toHaveBeenCalledWith('account@account.com');
        expect(Users.updateEmail).toHaveBeenCalledWith(1, 'account@account.com');

        expect(fetchRedirect).toHaveBeenCalledWith(
            req,
            res,
            'Successful change email.'
        );
    });

    test('changeEmail fails when the username is already taken', async() => {
        // if we set the query to this, the email will already exist and an error will be thrown
        Users.selectByEmail.mockResolvedValue(users);

        await changeEmail(req, res);

        expect(fetchAlertRedirect).toHaveBeenCalledWith(
            req,
            res,
            "Account with that email already exists."
        );
    });

    //changePassword test (3)
    test('changePassword works', async() => {
        //query the user we are looking for
        Users.selectByID.mockResolvedValue([users[0]]);
        Users.updatePassword.mockResolvedValue();

        //auto set passwords to match and "hashes" the new password
        bcrypt.compare.mockResolvedValue(true);
        bcrypt.hash.mockResolvedValue('hashed_new_password');
        
        await changePassword(req, res);

        expect(Users.selectByID).toHaveBeenCalledWith(1);
        expect(bcrypt.compare).toHaveBeenCalledWith('password_old', 'password_old');
        expect(bcrypt.hash).toHaveBeenCalledWith('password_new', 10);
        expect(Users.updatePassword).toHaveBeenCalledWith(1, 'hashed_new_password');

        expect(fetchRedirect).toHaveBeenCalledWith(
            req,
            res,
            'Successful change password.'
        );
    });

    test('changePassword fails if the new password does not match', async() => {
        //sets the new repeat password to not match
        req.body.password_new_repeat = 'different_password';

        await changePassword(req, res);

        expect(fetchAlertRedirect).toHaveBeenCalledWith(
            req,
            res,
            "New passwords do not match."
        );
    });

    test('changePassword fails if the old password does not match', async() => {
        //query the user we are looking for
        Users.selectByID.mockResolvedValue([users[0]]);

        //auto set passwords to not match and "hashes" the new password
        bcrypt.compare.mockResolvedValue(false);
        
        await changePassword(req, res);

        expect(Users.selectByID).toHaveBeenCalledWith(1);
        expect(bcrypt.compare).toHaveBeenCalledWith('password_old', 'password_old');

        expect(fetchAlertRedirect).toHaveBeenCalledWith(
            req,
            res,
            "Old password does not match."
        );
    });
    
    //logOut tests (2)
    test('logOut success', async() => {
        await logOut(req, res);
        
        expect(req.session.isAuth).toBe(false);
        expect(req.session.accountID).toBe(undefined);
        expect(req.session.username).toBe(undefined);
        expect(req.session.isAdmin).toBe(undefined);

        expect(fetchRedirect).toHaveBeenCalledWith(
            req,
            res,
            "Successful log out."
        );
    })

    test('logOut failure', async() => {
        fetchRedirect.mockImplementation(() => { throw new Error('Forced error') });

        await logOut(req, res);

        expect(fetchAlertRedirect).toHaveBeenCalledWith(
            req,
            res,
            "An error occurred while trying to log out."
        );
    })

    test('deleteAccount success', async() => {
        Users.deleteUser.mockResolvedValue();

        await deleteAccount(req, res);
        
        expect(req.session.isAuth).toBe(false);
        expect(req.session.accountID).toBe(undefined);
        expect(req.session.username).toBe(undefined);
        expect(req.session.isAdmin).toBe(undefined);
        
        expect(Users.deleteUser).toHaveBeenCalledWith(1);

        expect(fetchRedirect).toHaveBeenCalledWith(
            req,
            res,
            "Successful deleting of account."
        );
    })

    test('deleteAccount failure', async() => {
        fetchRedirect.mockImplementation(() => { throw new Error('Forced error') });

        await deleteAccount(req, res);

        expect(fetchAlertRedirect).toHaveBeenCalledWith(
            req,
            res,
            "An error occurred while trying to delete account."
        );
    })


    
})