import { Pool } from 'pg';
import dotenv from 'dotenv';
import brcypt from 'bcrypt-nodejs';
import sqlQueries from './sqlQueries';

dotenv.config();
let pool;
if (process.env.DATABASE_URL) {
  const connectionString = process.env.DATABASE_URL;
  pool = new Pool({
    connectionString,
  });
} else {
  pool = new Pool();
}
const connect = async () => pool.connect();
const prepareDatabase = () => new Promise(async (resolve) => {
  const adminData = [
    process.env.ADMINFIRSTNAME,
    process.env.ADMINLASTNAME,
    process.env.ADMINOTHERNAME,
    process.env.ADMINPHONENUMBER,
    process.env.ADMINUSERNAME,
    process.env.ADMINEMAIL,
    brcypt.hashSync(process.env.ADMINPASSWORD),
  ];
  const connection = await connect();
  await connection.query(sqlQueries.tablesQuery);
  await connection.query(sqlQueries.adminQuery, adminData);
  connection.release();
  resolve();
});
const jwtSecretWord = process.env.JWTSECRETWORD;
if (process.env.NODE_ENV !== 'test') {
  prepareDatabase();
}

const executeQuery = async (query, params = []) => {
  let connection;
  try {
    connection = await connect();
    const result = await connection.query(query, params);
    return result.rows;
  } finally {
    connection.release();
  }
};

export {
  prepareDatabase,
  connect,
  jwtSecretWord,
  executeQuery,
};
