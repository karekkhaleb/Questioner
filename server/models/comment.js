import { databaseErrorObj } from '../db/utils';
import { executeQuery } from '../db';

export default class Comment {
  static addComment = async (questionId, userId, comment) => {
    const query = `with new_comment (user_id, question_id, comment) as (
        insert into  comments (user_id, question_id, comment)
          values ($1, $2, $3)
          returning user_id, question_id, comment
      )
      select comment, q.id as question_id, q.title as question_title, q.body as question_body
      from new_comment
      join questions q on q.id = new_comment.question_id;`;
    try {
      const result = await executeQuery(query, [userId, questionId, comment]);
      return {
        question: result[0].question_id,
        title: result[0].question_title,
        body: result[0].question_body,
        comment: result[0].comment,
      };
    } catch (e) {
      if (e.detail === `Key (user_id)=(${userId}) is not present in table "users".`) {
        return { status: 404, error: 'User creating comment not found' };
      }
      if (e.detail === `Key (question_id)=(${questionId}) is not present in table "questions".`) {
        return { status: 404, error: 'Question not found' };
      }
      return databaseErrorObj;
    }
  };
}
