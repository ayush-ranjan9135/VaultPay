const axios = require('axios');

async function testCors() {
  try {
    const res = await axios.options('https://vaultpay-00u4.onrender.com/api/auth/login', {
      headers: {
        'Origin': 'https://vault-pay-sandy.vercel.app',
        'Access-Control-Request-Method': 'POST'
      }
    });
    console.log('CORS headers:', res.headers);
  } catch (e) {
    console.error('Error:', e.message);
  }
}

testCors();
