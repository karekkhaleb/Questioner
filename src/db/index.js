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
const prepareDatabase = async () => {
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
};

class Database {
  constructor() {
    // =========================
    this.meetups = [];
    this.questions = [];
    this.users = [];
    this.rsvps = [];
    // =========================
  }

  addMeetup = async ({ ...meetupData }) => {
    const query = `insert into meetups (
      location, topic, happening_on) 
      values ($1, $2, $3) returning *;
    `;
    const queryParams = [
      meetupData.location,
      meetupData.topic,
      meetupData.happeningOn,
    ];
    const connection = await connect();
    try {
      const result = await connection.query(query, queryParams);
      const newMeetup = result.rows[0];
      return {
        id: newMeetup.id,
        createdOn: newMeetup.created_on,
        location: newMeetup.location,
        topic: newMeetup.topic,
        happeningOn: newMeetup.happening_on,
      };
    } catch (e) {
      return databaseErrorObj;
    } finally {
      connection.release();
    }
  };

  getAllMeetps = async () => {
    const meetupsQuery = `select m.id, m.topic, m.location, m.happening_on, array_agg(t.tag_name) as tags
      from meetups m
      left join meetups_tags mt on mt.meetup_id = m.id
      left join tags t on mt.tag_id = t.id
      group by m.id;`;
    const connection = await connect();
    try {
      const result = await connection.query(meetupsQuery);
      const requiredMeetups = [];
      result.rows.forEach((row) => {
        requiredMeetups.push({
          id: row.id,
          title: row.topic,
          location: row.location,
          happeningOn: row.happening_on,
          tags: row.tags,
        });
      });
      return requiredMeetups;
    } catch (e) {
      return databaseErrorObj;
    } finally {
      connection.release();
    }
  };

  getSingleMeetup = async (meetupId) => {
    // const query = 'select * from meetups where id = $1;';
    const query = `select 
        m.id, m.topic, m.location, m.happening_on, array_remove(array_agg(t.tag_name), null ) as tags
        from meetups m
        left join meetups_tags mt on mt.meetup_id = m.id
        left join tags t on mt.tag_id = t.id
      where m.id = $1
        group by m.id;`;
    const connection = await connect();
    try {
      const result = await connection.query(query, [meetupId]);
      if (result.rows.length === 0) {
        return {
          status: 404,
          error: 'Meetup not found',
        };
      }
      return {
        id: result.rows[0].id,
        topic: result.rows[0].topic,
        location: result.rows[0].location,
        happeningOn: result.rows[0].happening_on,
        tags: result.rows[0].tags,
      };
    } catch (e) {
      return databaseErrorObj;
    } finally {
      connection.release();
    }
  };

  getUpcomingMeetups = async () => {
    // const query = 'select * from meetups where happening_on > now();';
    const query = `select 
        m.id, m.topic, m.location, m.happening_on, array_remove(array_agg(t.tag_name), null ) as tags
        from meetups m
        left join meetups_tags mt on mt.meetup_id = m.id
        left join tags t on mt.tag_id = t.id
      where happening_on > now()
        group by m.id;`;
    const connection = await connect();
    try {
      const result = await connection.query(query);
      const meetups = [];
      result.rows.forEach((row) => {
        meetups.push({
          id: row.id,
          title: row.topic,
          location: row.location,
          happeningOn: row.happening_on,
          tags: row.tags,
        });
      });
      return meetups;
    } catch (e) {
      return databaseErrorObj;
    } finally {
      connection.release();
    }
  };

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

  addTagToMeetup = async (tagId, meetupId) => {
    const insertQuery = `insert into meetups_tags (meetup_id, tag_id)
                          values ($1, $2)`;
    const getQuery = `select m.id, m.topic, array_agg(t.tag_name) as tag_name
      from meetups_tags mt
      join meetups m on mt.meetup_id = m.id
      join tags t on mt.tag_id = t.id
      where mt.meetup_id = $1
      group by m.id;`;
    let connection;
    try {
      connection = await connect();
      await connection.query(insertQuery, [meetupId, tagId]);
      const result = await connection.query(getQuery, [meetupId]);
      return result.rows;
    } catch (e) {
      if (e.detail === `Key (meetup_id)=(${meetupId}) is not present in table "meetups".`) {
        return {
          status: 404,
          error: 'Meetup not found',
        };
      }
      if (e.detail === `Key (meetup_id, tag_id)=(${meetupId}, ${tagId}) already exists.`) {
        return {
          status: 400,
          error: 'Record already exists',
        };
      }
      return databaseErrorObj;
    } finally {
      connection.release();
    }
  };

  deleteMeetup = async (meetupId) => {
    const query = 'delete from meetups where id = $1 returning *;';
    let connection;
    try {
      connection = await connect();
      const deleted = await connection.query(query, [meetupId]);
      if (!deleted.rows.length) {
        return {
          status: 404,
          error: 'Meetup not found',
        };
      }
      return true;
    } catch (e) {
      return databaseErrorObj;
    } finally {
      connection.release();
    }
  };

  addQuestion = async (meetupId, createdBy, title, body) => {
    const query = `insert into questions (created_by, meetup, title, body)
      VALUES ($1, $2, $3, $4) returning *;`;
    let connection;
    try {
      connection = await connect();
      const result = await connection.query(query, [createdBy, meetupId, title, body]);
      return result.rows[0];
    } catch (e) {
      if (e.detail === `Key (created_by)=(${createdBy}) is not present in table "users".`) {
        return { status: 404, error: 'User creating question not found' };
      }
      if (e.detail === `Key (meetup)=(${meetupId}) is not present in table "meetups".`) {
        return { status: 404, error: 'Meetup not found' };
      }
      return databaseErrorObj;
    } finally {
      connection.release();
    }
  };

  getMeetupQuestions = async (meetupId) => {
    const query = 'select * from questions where meetup = $1;';
    let connection;
    try {
      connection = await connect();
      const result = await connection.query(query, [meetupId]);
      return result.rows;
    } catch (e) {
      return databaseErrorObj;
    } finally {
      connection.release();
    }
  };

  vote = async (questionId, action) => {
    let query;
    if (action === 'upvote') {
      query = `update questions
      set votes = votes + 1
      where id = $1 returning *;`;
    } else {
      query = `update questions
      set votes = votes - 1
      where id = $1 returning *;`;
    }
    let connection;
    try {
      connection = await connect();
      const result = await connection.query(query, [questionId]);
      if (result.rows.length === 0) {
        return {
          status: 404,
          error: 'No question matches that id',
        };
      }
      return result.rows[0];
    } catch (e) {
      return databaseErrorObj;
    } finally {
      connection.release();
    }
  };

  signup = async (userCredentials) => {
    const userParams = [
      userCredentials.firstname,
      userCredentials.lastname,
      userCredentials.othername ? userCredentials.othername : '',
      userCredentials.password,
      Number.parseInt(userCredentials.phoneNumber, 10),
      userCredentials.userName,
      userCredentials.email,
    ];
    const query = `insert into users(
      first_name, 
      last_name, 
      other_name, 
      password, 
      phone_number, 
      user_name, 
      email)
        VALUES(
          $1, $2, $3, $4, $5, $6, $7
        ) returning *;
    `;
    let connection;
    try {
      connection = await connect();
      const result = await connection.query(query, userParams);
      return result.rows[0];
    } catch (e) {
      if (e.detail === `Key (user_name)=(${userCredentials.userName}) already exists.`) {
        return {
          status: 400,
          error: 'Please chose another userName',
        };
      }
      if (e.detail === `Key (email)=(${userCredentials.email}) already exists.`) {
        return {
          status: 400,
          error: 'Please chose another email',
        };
      }
      return databaseErrorObj;
    } finally {
      connection.release();
    }
  };

  login = async (email) => {
    const query = 'select * from users where email = $1 ; ';
    let connection;
    try {
      connection = await connect();
      const result = await connection.query(query, [email]);
      return result.rows;
    } catch (e) {
      return databaseErrorObj;
    } finally {
      connection.release();
    }
  };

  respondRsvp = async ({ ...rsvpData }) => {
    const query = `with newrsvps (meetup, response) as (
          insert into rsvps (user_id, meetup, response)
        values ($1, $2, $3) returning meetup, response
        )
        select * from newrsvps
        join meetups m on m.id = newrsvps.meetup;`;
    const params = [rsvpData.userId, rsvpData.meetupId, rsvpData.status];
    let connection;
    try {
      connection = await connect();
      const result = await connection.query(query, params);
      return {
        meetupId: result.rows[0].meetup,
        meetupTopic: result.rows[0].topic,
        status: result.rows[0].response,
      };
    } catch (e) {
      if (e.detail === `Key (user_id, meetup)=(${rsvpData.userId}, ${rsvpData.meetupId}) already exists.`) {
        return {
          status: 400,
          error: 'User already responded to this meetup',
        };
      }
      if (e.detail === `Key (user_id)=(${rsvpData.userId}) is not present in table "users".`) {
        return {
          status: 400,
          error: 'User not available',
        };
      }
      if (e.detail === `Key (meetup)=(${rsvpData.meetupId}) is not present in table "meetups".`) {
        return {
          status: 400,
          error: 'Meetup not available',
        };
      }
      return databaseErrorObj;
    } finally {
      connection.release();
    }
  }
}

export default new Database();
export {
  prepareDatabase,
};
