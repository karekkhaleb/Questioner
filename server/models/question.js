import dbUtils from '../db/utils';
import { executeQuery } from '../db';

const { databaseErrorObj } = dbUtils;

export default class Question {
  static addQuestion = async (meetupId, createdBy, title, body) => {
    const query = `insert into questions (created_by, meetup, title, body)
      VALUES ($1, $2, $3, $4) returning *;`;
    try {
      const result = await executeQuery(query, [createdBy, meetupId, title, body]);
      return {
        id: result[0].id,
        user: result[0].created_by,
        meetup: result[0].meetup,
        title: result[0].title,
        body: result[0].body,
      };
    } catch (e) {
      if (e.detail === `Key (meetup)=(${meetupId}) is not present in table "meetups".`) {
        return { status: 404, error: 'Meetup not found' };
      }
      return databaseErrorObj;
    }
  };

  static vote = async (questionId, userId, action) => {
    try {
      const getVotesQuery = 'select * from votes where user_id = $1 and question_id = $2;';
      const rows = await executeQuery(getVotesQuery, [userId, questionId]);
      let query;
      if (action === 'upvote') {
        if (!rows.length) {
          query = `insert into votes (question_id, user_id, up_vote) 
                  values ($1, $2, true) returning *;`;
          await executeQuery(query, [questionId, userId]);
        }
        if (rows[0] && rows[0].up_vote === true) return { status: 403, error: 'you can not up-vote twice' };
        query = `update votes set up_vote = true, down_vote = false
                  where question_id = $1 and user_id = $2 returning *;
                  `;
        await executeQuery(query, [questionId, userId]);
      // eslint-disable-next-line no-else-return
      } else {
        if (!rows.length) {
          query = `insert into votes (question_id, user_id, down_vote) 
                  values ($1, $2, true) returning *;`;
          await executeQuery(query, [questionId, userId]);
        }
        if (rows[0] && rows[0].down_vote === true) return { status: 403, error: 'you can not down-vote twice' };
        const insertQuery = `update votes set up_vote = false, down_vote = true
                  where question_id = $1 and user_id = $2 returning *;`;
        await executeQuery(insertQuery, [questionId, userId]);
      }

      const getQuestionAndVotesQuery = `
          select q.id as question_id, m.id as meetup, q.title, q.body,
                 count(nullif(v.up_vote = false, true)) as up_votes,
                 count(nullif(v.down_vote = false, true)) as down_votes
          from questions q
          join votes v on q.id = v.question_id
          join meetups m on q.meetup = m.id
          where q.id = $1
          group by v.question_id, q.id, m.id
          ;`;
      const updatedQuestion = await executeQuery(getQuestionAndVotesQuery, [questionId]);
      return updatedQuestion[0];
    } catch (e) {
      if (e.detail === `Key (question_id)=(${questionId}) is not present in table "questions".`) {
        return {
          status: 404,
          error: 'question not found',
        };
      }
      return databaseErrorObj;
    }
  };

  static getComments = async (questionId) => {
    const query = `select 
      q.id, q.title, q.body, array_remove(array_agg(c.comment), null )  as comments
      from questions q
      left join comments c on q.id = c.question_id
      where q.id = $1
      group by q.id;`;
    try {
      return await executeQuery(query, [questionId]);
    } catch (e) {
      return databaseErrorObj;
    }
  };
}
