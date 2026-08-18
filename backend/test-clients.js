const axios = require('axios');

async function test() {
  try {
    const loginRes = await axios.post('https://vaultpay-00u4.onrender.com/api/auth/login', {
      email: 'admin@vaultpay.com',
      password: 'password123'
    });
    
    const cookies = loginRes.headers['set-cookie'];
    console.log('Cookies:', cookies);

    const clientsRes = await axios.get('https://vaultpay-00u4.onrender.com/api/admin/clients', {
      headers: { Cookie: cookies[0] }
    });

    console.log('Clients Data:', clientsRes.data);
  } catch (err) {
    console.error('Error:', err.response ? err.response.data : err.message);
  }
}

test();
