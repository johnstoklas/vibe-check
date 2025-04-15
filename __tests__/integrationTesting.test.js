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
            // Get user id first to delete unlocked characters
            const [user] = await connection.query(
                'SELECT userid FROM accounts WHERE email = ? OR username = ?',
                [TEST_USER.email, TEST_USER.username]
            );

            if (user && user.length > 0) {
                // Delete unlocked characters first (foreign key constraint)
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
        
        // Updated expectations to match your actual auth controller response
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
        
        // Updated expectations to match your actual auth controller response
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

    test('should get user unlocked characters', async () => {
        const response = await agent
            .get('/api/unlocked-characters')
            .expect('Content-Type', /json/);

        console.log('Unlocked Characters Response:', response.body);
        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBe(8); // Expect 8 unlocked characters
    });
});