const axios = require('axios');

// Make sure this port matches your server's port
const PORT = 3000;

const api = axios.create({
    baseURL: `http://localhost:${PORT}`,
    withCredentials: true
});

async function runSimpleTests() {
    console.log('Starting simple character tests...');
    console.log('Time:', '2025-03-27 23:27:38');
    console.log('User:', 'Pr0fessionalBum');

    try {
        // First, make sure server is running
        console.log('\nChecking server connection...');
        await api.get('/');
        console.log('✓ Server is running!');

        // Test public route
        console.log('\nTesting public characters route...');
        const publicResponse = await api.get('/api/characters');
        console.log('✓ Public route works! Found', publicResponse.data.data.length, 'characters');

        // Login
        console.log('\nLogging in...');
        await api.post('/auth/login', {
            username: 'Pr0fessionalBum',
            password: 'password123'  // Replace with your password
        });
        console.log('✓ Login successful!');

        // Test protected route
        console.log('\nTesting protected route...');
        const protectedResponse = await api.get('/api/unlocked-characters');
        console.log('✓ Protected route works! Found', protectedResponse.data.data.length, 'unlocked characters');

        console.log('\nAll tests passed! 🎉');
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.error('\n❌ Error: Could not connect to server!');
            console.error(`Make sure your server is running on port ${PORT}`);
            console.error('Start your server with: npm start');
        } else {
            console.error('\n❌ Test failed:', error.response?.data?.error || error.message);
        }
    }
}

// Add a small delay to make sure server has time to start
setTimeout(runSimpleTests, 1000);