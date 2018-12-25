/* eslint-disable consistent-return */
import database from '../db';

class QuestionController {
  create = (req, res) => {
    const createdQuestion = database.addQuestion(
      Number.parseInt(req.body.meetup, 10),
      Number.parseInt(req.body.createdBy, 10),
      req.body.title,
      req.body.body,
    );

    if (createdQuestion && createdQuestion.error) {
      res.status(createdQuestion.status).json({
        status: createdQuestion.status,
        error: createdQuestion.error,
      });
    } else if (createdQuestion && createdQuestion.title) {
      res.status(201).json({
        status: 201,
        data: [{
          createdBy: createdQuestion.createdBy,
          meetup: createdQuestion.meetup,
          title: createdQuestion.title,
          body: createdQuestion.body,
        }],
      });
    }
  };

  getAll = (req, res) => {
    res.status(200).json({
      status: 200,
      data: database.questions,
    });
  };

  upVote = (req, res) => {
    const questionId = Number.parseInt(req.params.questionId, 10);
    const upVotedQuestion = database.vote(questionId, 'upvote');
    if (upVotedQuestion) {
      return res.status(200).json({
        status: 200,
        data: [{
          meetup: upVotedQuestion.meetup,
          title: upVotedQuestion.title,
          body: upVotedQuestion.body,
          votes: upVotedQuestion.votes,
        }],
      });
    }
    return res.status(404).json({
      status: 404,
      error: 'No question matches that id',
    });
  };

  downVote = (req, res) => {
    const questionId = Number.parseInt(req.params.questionId, 10);
    const downVotedQuestion = database.vote(questionId, 'downvote');
    if (downVotedQuestion) {
      return res.status(200).json({
        status: 200,
        data: [{
          meetup: downVotedQuestion.meetup,
          title: downVotedQuestion.title,
          body: downVotedQuestion.body,
          votes: downVotedQuestion.votes,
        }],
      });
    }
    return res.status(404).json({
      status: 404,
      error: 'No question matches that id',
    });
  }
}

export default new QuestionController();
