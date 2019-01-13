/* eslint-disable no-restricted-syntax,no-plusplus */
import { Pool } from 'pg';
import dotenv from 'dotenv';
import brcypt from 'bcrypt-nodejs';
import sqlQueries from './sqlQueries';
import { databaseErrorObj } from './utils';

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
class Database {
  createTag = async (tagName) => {
    const query = 'insert into tags(tag_name) values ($1) returning *';
    const connection = await connect();
    try {
      const result = await connection.query(query, [tagName]);
      return {
        id: result.rows[0].id,
        tagName: result.rows[0].tag_name,
      };
    } catch (e) {
      if (e.detail && e.detail.includes('already exists')) {
        return {
          status: 400,
          error: 'Tag already exists',
        };
      }
      return databaseErrorObj;
    } finally {
      connection.release();
    }
  };

  getAllTags = async () => {
    const query = 'select * from tags';
    const connection = await connect();
    try {
      const result = await connection.query(query);
      return result.rows;
    } catch (e) {
      return databaseErrorObj;
    } finally {
      connection.release();
    }
  };

  // addQuestion = async (meetupId, createdBy, title, body) => {
  //   const query = `insert into questions (created_by, meetup, title, body)
  //     VALUES ($1, $2, $3, $4) returning *;`;
  //   let connection;
  //   try {
  //     connection = await connect();
  //     const result = await connection.query(query, [createdBy, meetupId, title, body]);
  //     return {
  //       id: result.rows[0].id,
  //       user: result.rows[0].created_by,
  //       meetup: result.rows[0].meetup,
  //       title: result.rows[0].title,
  //       body: result.rows[0].body,
  //     };
  //   } catch (e) {
  //     if (e.detail === `Key (created_by)=(${createdBy}) is not present in table "users".`) {
  //       return { status: 404, error: 'User creating question not found' };
  //     }
  //     if (e.detail === `Key (meetup)=(${meetupId}) is not present in table "meetups".`) {
  //       return { status: 404, error: 'Meetup not found' };
  //     }
  //     return databaseErrorObj;
  //   } finally {
  //     connection.release();
  //   }
  // };

  // vote = async (questionId, action) => {
  //   let query;
  //   if (action === 'upvote') {
  //     query = `update questions
  //     set votes = votes + 1
  //     where id = $1 returning *;`;
  //   } else {
  //     query = `update questions
  //     set votes = votes - 1
  //     where id = $1 returning *;`;
  //   }
  //   let connection;
  //   try {
  //     connection = await connect();
  //     const result = await connection.query(query, [questionId]);
  //     if (result.rows.length === 0) {
  //       return {
  //         status: 404,
  //         error: 'No question matches that id',
  //       };
  //     }
  //     return result.rows[0];
  //   } catch (e) {
  //     return databaseErrorObj;
  //   } finally {
  //     connection.release();
  //   }
  // };
}

export default new Database();
export {
  prepareDatabase,
  connect,
  jwtSecretWord,
  executeQuery,
};
