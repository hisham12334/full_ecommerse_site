// backend/create-admin.js
const { Client } = require('pg');
const bcrypt = require('bcryptjs');

// 1. Paste your Connection String here (same one you used to clear the DB)
const connectionString = "postgresql://neondb_owner:npg_1x0siLDdAuMP@ep-sweet-bonus-a8hnnxtq-pooler.eastus2.azure.neon.tech/neondb?sslmode=require";

const client = new Client({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function createAdmin() {
  try {
    console.log('Connecting to database...');
    await client.connect();

    // 2. Define Admin Credentials
    const email = 'qadr.fits@gmail.com';
    const password = 'Qadrfits@2025';
    const name = 'Admin';

    console.log(`Creating admin account for ${email}...`);

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Check if user exists (just in case)
    const checkUser = await client.query("SELECT * FROM users WHERE email = $1", [email]);

    if (checkUser.rows.length > 0) {
      // Update existing
      await client.query(
        "UPDATE users SET password = $1, role = 'admin', name = $2 WHERE email = $3",
        [hashedPassword, name, email]
      );
      console.log('✅ Updated existing user to Admin.');
    } else {
      // Insert new
      await client.query(
        "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, 'admin')",
        [name, email, hashedPassword]
      );
      console.log('✅ Created NEW Admin user.');
    }

    console.log('-----------------------------------');
    console.log('Login with these credentials:');
    console.log(`Email:    ${email}`);
    console.log(`Password: ${password}`);
    console.log('-----------------------------------');

  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await client.end();
  }
}

createAdmin();