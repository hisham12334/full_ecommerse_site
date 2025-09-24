require('dotenv').config();
const fs = require('fs');
const path = require('path');
const database = require('../src/config/database');

async function runMigrations() {
  const db = database.connect();
  
  try {
    console.log('Running database migrations...');
    
    const migrationFile = path.join(__dirname, '../src/migrations/add_product_indexes.sql');
    const sql = fs.readFileSync(migrationFile, 'utf8');
    
    await db.query(sql);
    console.log('✅ Database indexes created successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await db.end();
  }
}

runMigrations();