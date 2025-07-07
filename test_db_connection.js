const { connectDB, client } = require('./config/db');

async function testConnection() {
  try {
    await connectDB();
    console.log('Database connection successful!');
  } catch (error) {
    console.error('Database connection failed:', error.message);
  } finally {
    if (client) {
      await client.close();
      console.log('Database client closed.');
    }
  }
}

testConnection();