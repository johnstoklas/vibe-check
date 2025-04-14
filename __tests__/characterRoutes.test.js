const axios = require('axios');
const { databaseConnection } = require('../other/database'); // Import the existing database connection

// Configuration
const BASE_URL = 'http://localhost:3000';
const TEST_USER = {
    username: 'Pr0fessionalBum',
    password: 'testPassword123'  // Replace with your actual password
};

// Create axios instance
const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
});

// Test runner
async function testCharacterRoutes() {
    console.log('=== Character Routes Test ===');
    console.log('Date:', '2025-04-04 02:22:24');
    console.log('User:', 'Pr0fessionalBum');
    console.log('================\n');

    try {
        // Connect to the database using the existing connection
        const connection = await databaseConnection;

        // Test 1: Get all characters (public route)
        console.log('Test 1: Get all characters (Public Route)');
        const allChars = await api.get('/api/characters');
        console.log('✓ Success! Characters found:', allChars.data.data.length);
        console.log('Sample character:', allChars.data.data[0]);
        console.log('================\n');

        // New Step: Create user account using /signup route
        console.log('Step: Create user account');
        const createUserResponse = await api.post('/auth/signup', {
            email: 'testuser@example.com',
            username: TEST_USER.username,
            password: TEST_USER.password,
            password_repeat: TEST_USER.password
        });
        console.log('✓ User account created successfully!');
        console.log('================\n');

        // Alter the user to become an admin
        console.log('Step: Promote user to admin');
        await connection.query('UPDATE accounts SET admin = 1 WHERE username = ?', [TEST_USER.username]);
        console.log('✓ User promoted to admin successfully!');
        console.log('================\n');

        // Test 2: Login first
        console.log('Test 2: Login');
        const loginResponse = await api.post('/auth/login', {
            username: TEST_USER.username,
            password: TEST_USER.password
        });
        console.log('✓ Login successful!');
        console.log('Login Response Headers:', loginResponse.headers);
        console.log('================\n');

        // Test 3: Get all Traits (public route)
        console.log('Test 3: getTraits');
        const getTraitsResponse = await api.get('/api/traits');
        console.log('✓ Success! Traits found:', getTraitsResponse.data.data.length);
        console.log('Sample trait:', getTraitsResponse.data.data[0]);
        console.log('================\n');

--
        console.log('All tests completed successfully! 🎉');
        console.log('================\n');
        
    } catch (error) {
        console.error('❌ Test failed!');
        console.error('Error:', error.response?.data || error.message);
        console.error('Status:', error.response?.status);
        console.error('At:', new Date().toISOString());
    }
}

// Run the tests
testCharacterRoutes();