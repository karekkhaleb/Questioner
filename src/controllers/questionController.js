/* eslint-disable consistent-return */
import database, { connect } from '../db';
import { databaseErrorObj } from '../db/utils';

class QuestionController {
  create = async (req, res) => {
    const createdQuestion = await database.addQuestion(
      Number.parseInt(req.body.meetupId, 10),
      Number.parseInt(req.body.createdBy, 10),
      req.body.title,
      req.body.body,
    );

    if (createdQuestion && createdQuestion.error) {
      return res.status(createdQuestion.status).json({
        status: createdQuestion.status,
        error: createdQuestion.error,
      });
    }
    res.status(201).json({
      status: 201,
      data: [createdQuestion],
    });
  };

  upVote = async (req, res) => {
    const questionId = Number.parseInt(req.params.questionId, 10);
    const upVotedQuestion = await database.vote(questionId, 'upvote');
    if (upVotedQuestion && upVotedQuestion.error) {
      return res.status(upVotedQuestion.status).json(upVotedQuestion);
    }
    return res.status(200).json({
      status: 200,
      data: [{
        id: upVotedQuestion.id,
        meetup: upVotedQuestion.meetup,
        title: upVotedQuestion.title,
        body: upVotedQuestion.body,
        votes: upVotedQuestion.votes,
      }],
    });
  };

  downVote = async (req, res) => {
    const questionId = Number.parseInt(req.params.questionId, 10);
    const downVotedQuestion = await database.vote(questionId, 'downvote');
    if (downVotedQuestion && downVotedQuestion.error) {
      return res.status(downVotedQuestion.status).json(downVotedQuestion);
    }
    res.status(200).json({
      status: 200,
      data: [{
        id: downVotedQuestion.id,
        meetup: downVotedQuestion.meetup,
        title: downVotedQuestion.title,
        body: downVotedQuestion.body,
        votes: downVotedQuestion.votes,
      }],
    });
  };

  getComments = async (req, res) => {
    const questionId = Number.parseInt(req.params.questionId, 10);
    if (Number.isNaN(questionId)) {
      return res.status(400).json({
        status: 400,
        error: 'questionId is required and should be a number',
      });
    }
    const query = `select 
      q.id, q.title, q.body, array_remove(array_agg(c.comment), null )  as comments
      from questions q
      left join comments c on q.id = c.question_id
      where q.id = $1
      group by q.id;`;
    let connection;
    let result;
    try {
      connection = await connect();
      result = await connection.query(query, [questionId]);
      if (result.rows.length === 0) {
        return res.status(404).json({
          status: 404,
          error: 'Question not found',
        });
      }
      return res.status(200).json({
        status: 200,
        data: [{
          questionId,
          questionTitle: result.rows[0].title,
          questionBody: result.rows[0].body,
          comments: result.rows[0].comments,
        }],
      });
    } catch (e) {
      return res.status(databaseErrorObj.status).json(databaseErrorObj);
    } finally {
      connection.release();
    }
  }
}

export default new QuestionController();
