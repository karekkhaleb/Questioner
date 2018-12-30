/* eslint-disable no-restricted-syntax,no-plusplus */
import {Pool} from 'pg';
import dotenv from 'dotenv';
import models from './models';
import sqlQueries from './sqlQueries';

dotenv.config();

const {
  Meetup, Question, User, Rsvp,
} = models;

let pool;
if (process.env.DATABASE_URL) {
  const connectionString = process.env.DATABASE_URL;
  pool = new Pool({
    connectionString,
  });
} else {
  pool = new Pool();
}
const connect = async () => await pool.connect();

class Database {
  constructor() {
    // =========================
    this.meetups = [];
    this.questions = [];
    this.users = [];
    this.rsvps = [];
    // =========================
    this.prepareDatabase();
  }
  async prepareDatabase() {
    const adminData = [
      process.env.ADMINFIRSTNAME,
      process.env.ADMINLASTNAME,
      process.env.ADMINOTHERNAME,
      process.env.ADMINPHONENUMBER,
      process.env.ADMINUSERNAME,
      process.env.ADMINEMAIL,
    ];
    const connection = await connect();
    await connection.query(sqlQueries.usersTableQuery);
    await connection.query(sqlQueries.meetupsTableQuery);
    await connection.query(sqlQueries.tagsTableQuery);
    await connection.query(sqlQueries.meetupsTagsTableQuery);
    await connection.query(sqlQueries.questionsTableQuery);
    await connection.query(sqlQueries.commentsTableQuery);
    await connection.query(sqlQueries.rsvpsTableQuery);
    await connection.query(sqlQueries.adminQuery, adminData);
    connection.release();
  }

  async addMeetup({...meetupData}) {
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
       }
     } catch (e) {
       return {
         status: 500,
         error: 'Something went wrong on the database'
       }
     } finally {
       connection.release();
     }
  }

  async getAllMeetps() {
    const meetupsQuery = 'select * from meetups';
    const connection = await connect();
    try {
      const result = await connection.query(meetupsQuery);
      const requiredMeetups = [];
      result.rows.forEach(row => {
        requiredMeetups.push({
          id: row.id,
          title: row.topic,
          location: row.location,
          happeningOn: row.happening_on,
        })
      });
      return requiredMeetups;
    } catch (e) {
      return {
        status: 500,
        error: "Something went wrong on the server"
      }
    } finally {
      connection.release();
    }
  }

  async getSingleMeetup(meetupId) {
    const query = 'select * from meetups where id = $1;';
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
        happeningOn: result.rows[0].happening_on
      }
    } catch (e) {
      return {
        status: 500,
        error: 'Something went wrong on the server'
      }
    } finally {
      connection.release();
    }
  }

  getUpcomingMeetups() {
    const upcomingMeetups = [];
    for (const meetup of this.meetups) {
      if (new Date(meetup.happeningOn) > new Date()) {
        upcomingMeetups.push(meetup);
      }
    }
    return upcomingMeetups;
  }

  addQuestion(meetupId, createdBy, title, body) {
    /**
     * checking if this meetups exists
     */
    let meetupExists = false;
    for (let i = 0; i < this.meetups.length; i++) {
      if (this.meetups[i].id === meetupId) {
        meetupExists = true;
        break;
      }
    }
    if (!meetupExists) {
      return { status: 404, error: 'Meetup not found' };
    }
    /**
     * checking if this user exists
     */
    let userExists = false;
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].id === Number.parseInt(createdBy, 10)) {
        userExists = true;
        break;
      }
    }
    if (!userExists) {
      return { status: 404, error: 'User creating question not found' };
    }

    const currentQuestionsLength = this.questions.length;
    const id = currentQuestionsLength ? this.questions[currentQuestionsLength - 1].id + 1 : 1;
    const newQuestion = new Question(
      id,
      createdBy,
      meetupId,
      title,
      body,
    );
    this.questions.push(newQuestion);
    return newQuestion;
  }

  vote(questionId, action) {
    let votedQuestion;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < this.questions.length; i++) {
      if (this.questions[i].id === questionId) {
        if (action === 'upvote') {
          this.questions[i].votes += 1;
          votedQuestion = this.questions[i];
          break;
        } else {
          this.questions[i].votes -= 1;
          votedQuestion = this.questions[i];
          break;
        }
      }
    }
    return votedQuestion || null;
  }

  signup(userCredentials) {
    const newId = this.users.length ? this.users[this.users.length - 1].id + 1 : 1;
    const newUser = new User({
      id: newId,
      firstname: userCredentials.firstname,
      lastname: userCredentials.lastname,
      email: userCredentials.email,
      othername: userCredentials.othername,
      phoneNumber: Number.parseInt(userCredentials.phoneNumber, 10),
      userName: userCredentials.userName,
      isAdmin: false,
    });
    this.users.push(newUser);
    return newUser;
  }

  respondRsvp({ ...rsvpData }) {
    const rsvpId = this.rsvps.length ? this.rsvps[this.rsvps.length - 1].id + 1 : 1;
    /**
     * Check if this meetup exists
     */
    let meetup;
    for (let i = 0; i < this.meetups.length; i++) {
      if (this.meetups[i].id === rsvpData.meetupId) {
        meetup = this.meetups[i];
        break;
      }
    }
    if (!meetup) return { status: 404, error: 'No matching meetup' };
    /**
     * Check if this user exists
     */
    let userExists = false;
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].id === rsvpData.userId) {
        userExists = true;
        break;
      }
    }
    if (!userExists) return { status: 404, error: 'No matching user' };
    const newRsvp = new Rsvp(
      rsvpId,
      rsvpData.meetupId,
      rsvpData.userId,
      rsvpData.status,
    );
    return {
      meetupId: newRsvp.meetup,
      meetupTopic: meetup.topic,
      status: newRsvp.status,
    };
  }
}

export default new Database();
