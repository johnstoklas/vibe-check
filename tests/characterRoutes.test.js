const axios = require('axios');
const bcrypt = require('bcrypt');
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
    console.log('Date:', '2025-04-03 20:17:42');
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
        console.log('================\n');

        // Test 3: Get unlocked characters (requires auth)
        console.log('Test 3: Get unlocked characters (Protected Route)');
        const unlockedChars = await api.get('/api/unlocked-characters');
        console.log('✓ Success! Unlocked characters found:', unlockedChars.data.data.length);
        if (unlockedChars.data.data.length > 0) {
            console.log('Sample unlocked character:', unlockedChars.data.data[0]);
        }
        console.log('================\n');

        // Test 4: Unlock a new character (requires auth)
        console.log('Test 4: Unlock a new character (Protected Route)');
        const characterToUnlock = allChars.data.data[0].characterid;
        const unlockResult = await api.post('/api/unlock-character', {
            characterid: characterToUnlock
        });
        console.log('✓ Success! Character unlocked:', unlockResult.data);
        console.log('================\n');

        // Test 5: Verify character was unlocked
        console.log('Test 5: Verify unlock');
        const verifyUnlock = await api.get('/api/unlocked-characters');
        const isUnlocked = verifyUnlock.data.data.some(char => 
            char.characterid === characterToUnlock
        );
        console.log('✓ Character unlock verified:', isUnlocked);
        console.log('================\n');

        // Test 6: Logout
        console.log('Test 6: Logout');
        await api.post('/auth/logout');
        console.log('✓ Logout successful!');
        console.log('================\n');

        console.log('All tests completed successfully! 🎉');

        // Close the database connection
        await connection.end();

    } catch (error) {
        console.error('❌ Test failed!');
        console.error('Error:', error.response?.data || error.message);
        console.error('Status:', error.response?.status);
        console.error('At:', new Date().toISOString());
    }
}

// Run the tests
testCharacterRoutes();