// Simple test script to verify authentication API
const testRegistration = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'job_seeker'
      }),
    });

    const data = await response.json();
    console.log('Registration Response:', response.status, data);
  } catch (error) {
    console.error('Registration Error:', error);
  }
};

// Run the test
testRegistration();
