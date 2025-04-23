require('dotenv').config();
const { Pool } = require('pg');
const { parse } = require('pg-connection-string');

const config = parse(process.env.DATABASE_URL);

const pool = new Pool({
  user: config.user,
  host: config.host,
  database: config.database,
  password: config.password,
  port: config.port,
  ssl: {
    rejectUnauthorized: false,
  },
  family: 4,
});

module.exports = pool;
