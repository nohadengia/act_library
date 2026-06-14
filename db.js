// Database connection
// We use the "pg" library and a connection Pool so we can reuse connections.

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '""',
  database: process.env.DB_NAME || 'act_library',
});

// we export the pool so the route files can run queries
module.exports = pool;
