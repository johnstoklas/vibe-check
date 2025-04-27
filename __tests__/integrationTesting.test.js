process.env.NODE_ENV = 'test';
process.env.PORT = '1111'; // Use a different port for testing

const request = require('supertest');
const app = require('../app');
const { databaseConnection } = require('../architecture/database');

describe('Character Routes Integration Tests', () => {
    const TEST_USER = {
        username: 'ChrisChan',
        password: 'testPassword123',
        email: 'sonichu4life@limewire.com'
    };
    
    let agent;
    let connection;

    beforeAll(async () => {
        connection = await databaseConnection;
        agent = request.agent(app);

        // Clean up any existing test user data
        try {
            // Get user id first
            const [user] = await connection.query(
                'SELECT userid FROM accounts WHERE email = ? OR username = ?',
                [TEST_USER.email, TEST_USER.username]
            );

            if (user && user.length > 0) {
                // Clean up games first
                await connection.query(
                    'DELETE FROM games WHERE userid = ?',
                    [user[0].userid]
                );

                // Delete unlocked characters (foreign key constraint)
                await connection.query(
                    'DELETE FROM unlocked_characters WHERE user_id = ?',
                    [user[0].userid]
                );

                // Then delete the user account
                await connection.query(
                    'DELETE FROM accounts WHERE userid = ?',
                    [user[0].userid]
                );
            }
        } catch (error) {
            console.log('Cleanup error:', error);
        }
    });

    afterAll(async () => {
        await connection.end();
    });

    test('should create a new user account', async () => {
        const response = await agent
            .post('/auth/signup')
            .send({
                email: TEST_USER.email,
                username: TEST_USER.username,
                password: TEST_USER.password,
                password_repeat: TEST_USER.password
            });

        console.log('Create User Response:', response.body);
        
        expect(response.status).toBe(302); // Expect redirect status
        expect(response.headers.location).toBe('/'); // Expect redirect to home
    });

    test('should login successfully', async () => {
        const response = await agent
            .post('/auth/login')
            .send({
                username: TEST_USER.username,
                password: TEST_USER.password
            });

        console.log('Login Response:', response.body);
        
        expect(response.status).toBe(302); // Expect redirect status
        expect(response.headers.location).toBe('/'); // Expect redirect to home
    });

    test('should get all traits', async () => {
        const response = await agent
            .get('/api/traits')
            .expect('Content-Type', /json/);

        console.log('Traits Response:', response.body);
        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('should get all characters with traits', async () => {
        const response = await agent
            .get('/api/characters')
            .expect('Content-Type', /json/);

        console.log('Characters Response:', response.body);
        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('should automatically unlock character when conditions are met', async () => {
        // Login first
        const loginResponse = await agent
            .post('/auth/login')
            .send({
                username: TEST_USER.username,
                password: TEST_USER.password
            });

        expect(loginResponse.status).toBe(302); // Verify login success

        // Add a game with high score to meet unlock conditions
        await connection.query(
            'INSERT INTO games (userid, topscore, topmoney) VALUES (?, ?, ?)',
            [1, 2000, 5000]  // Score that should unlock character 11
        );

        // Check character 11 (requires 2000 score)
        const firstCheck = await agent
            .get('/api/unlock/11')
            .expect('Content-Type', /json/);

        console.log('First Unlock Check:', firstCheck.body);
        if (firstCheck.status !== 200) {
            console.error('Unlock check failed:', firstCheck.body);
        }
        expect(firstCheck.status).toBe(200);
        expect(firstCheck.body.isUnlocked).toBe(true);

        // Verify character appears in unlocked characters list
        const unlockedResponse = await agent
            .get('/api/unlocked-characters')
            .expect('Content-Type', /json/);

        console.log('Updated Unlocked Characters:', unlockedResponse.body);
        expect(unlockedResponse.status).toBe(200);
        expect(unlockedResponse.body.data).toBeDefined();
        expect(Array.isArray(unlockedResponse.body.data)).toBe(true);
        expect(unlockedResponse.body.data.some(char => char.characterid === 11)).toBe(true);
    });

    test('should get user unlocked characters', async () => {
        const response = await agent
            .get('/api/unlocked-characters')
            .expect('Content-Type', /json/);

        console.log('Unlocked Characters Response:', response.body);
        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBe(9); // Expect 8 unlocked characters
    });
});