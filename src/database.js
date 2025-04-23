const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'db.dokkvlbxxijzsfkgaams.supabase.co',
  database: 'postgres',
  password: 'QAtester115!',
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
  family: 4,
});

module.exports = pool;
