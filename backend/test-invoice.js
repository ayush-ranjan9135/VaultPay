const axios = require('axios');

async function test() {
  try {
    // 1. Log in
    const loginRes = await axios.post('https://vaultpay-00u4.onrender.com/api/auth/login', {
      email: 'admin@vaultpay.com',
      password: 'password123'
    }, {
      headers: { 'Origin': 'https://vault-pay-sandy.vercel.app' }
    });
    
    const cookies = loginRes.headers['set-cookie'];

    // 2. Try to create invoice
    const createRes = await axios.post('https://vaultpay-00u4.onrender.com/api/admin/invoices', {
      clientId: '6a848be2dfa4fa72779f8ef1', // A dummy valid mongo ID or John Doe's ID from earlier
      dueDate: '2026-08-30',
      status: 'PENDING',
      items: [{ description: 'Test', quantity: 1, unitPrice: 1000, amount: 1000 }]
    }, {
      headers: { 
        'Cookie': cookies[0],
        'Origin': 'https://vault-pay-sandy.vercel.app' 
      }
    });

    console.log('Success:', createRes.data);
  } catch (err) {
    if (err.response) {
      console.error('Error 500 response:', err.response.data);
    } else {
      console.error('Error:', err.message);
    }
  }
}

test();
