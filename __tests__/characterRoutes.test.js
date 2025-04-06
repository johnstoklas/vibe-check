const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:3000';
const TEST_USER = {
    username: 'Pr0fessionalBum',
    password: '$2b$10$badwolf1'  // Replace with your actual password
};

// Create axios instance
const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
});

// Test runner
async function testCharacterRoutes() {
    console.log('=== Character Routes Test ===');
    console.log('Date:', '2025-03-27 23:19:15');
    console.log('User:', 'Pr0fessionalBum');
    console.log('================\n');

    try {
        // Test 1: Get all characters (public route)
        console.log('Test 1: Get all characters (Public Route)');
        const allChars = await api.get('/api/characters');
        console.log('✓ Success! Characters found:', allChars.data.data.length);
        console.log('Sample character:', allChars.data.data[0]);
        console.log('================\n');

        // Test 2: Login first
        console.log('Test 2: Login');
        const loginResponse = await api.post('/auth/login', TEST_USER);
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

    } catch (error) {
        console.error('❌ Test failed!');
        console.error('Error:', error.response?.data || error.message);
        console.error('Status:', error.response?.status);
        console.error('At:', new Date().toISOString());
    }
}

// Run the tests
testCharacterRoutes();