// Script to update admin credentials
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function updateAdmin() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const client = await pool.connect();
    console.log('Connected to database...');

    // Hash the new password
    const hashedPassword = await bcrypt.hash('Qadrfits@2025', 10);

    // Update the old admin or create new one
    const updateResult = await client.query(
      "UPDATE users SET email = $1, password = $2 WHERE email = 'admin@admin.com' RETURNING id",
      ['qadr.fits@gmail.com', hashedPassword]
    );

    if (updateResult.rows.length > 0) {
      console.log('✅ Admin credentials updated successfully!');
      console.log('   Email: qadr.fits@gmail.com');
      console.log('   Password: Qadrfits@2025');
    } else {
      // If old admin doesn't exist, check if new admin already exists
      const checkResult = await client.query(
        "SELECT id FROM users WHERE email = 'qadr.fits@gmail.com'"
      );

      if (checkResult.rows.length > 0) {
        // Update existing new admin
        await client.query(
          "UPDATE users SET password = $1, role = 'admin' WHERE email = 'qadr.fits@gmail.com'",
          [hashedPassword]
        );
        console.log('✅ Existing admin user updated with new password!');
      } else {
        // Create new admin
        await client.query(
          "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
          ['Admin', 'qadr.fits@gmail.com', hashedPassword, 'admin']
        );
        console.log('✅ New admin user created!');
      }
      console.log('   Email: qadr.fits@gmail.com');
      console.log('   Password: Qadrfits@2025');
    }

    client.release();
    await pool.end();
  } catch (error) {
    console.error('❌ Error updating admin:', error);
    process.exit(1);
  }
}

updateAdmin();
