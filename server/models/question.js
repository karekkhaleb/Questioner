import { databaseErrorObj } from '../db/utils';
import { executeQuery } from '../db';

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
      if (e.detail === `Key (created_by)=(${createdBy}) is not present in table "users".`) {
        return { status: 404, error: 'User creating question not found' };
      }
      if (e.detail === `Key (meetup)=(${meetupId}) is not present in table "meetups".`) {
        return { status: 404, error: 'Meetup not found' };
      }
      return databaseErrorObj;
    }
  };

  static vote = async (questionId, action) => {
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
    try {
      const result = await executeQuery(query, [questionId]);
      if (result.length === 0) {
        return {
          status: 404,
          error: 'No question matches that id',
        };
      }
      return result[0];
    } catch (e) {
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
