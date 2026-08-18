const axios = require('axios');

async function testPost() {
  try {
    const res = await axios.post('https://vaultpay-00u4.onrender.com/api/auth/login', {
      email: 'admin@vaultpay.com',
      password: 'password123'
    }, {
      headers: {
        'Origin': 'https://vault-pay-sandy.vercel.app'
      }
    });
    console.log('Login successful:', res.data);
  } catch (e) {
    console.error('Error:', e.response ? e.response.status + ' ' + e.response.data.message : e.message);
  }
}

testPost();
