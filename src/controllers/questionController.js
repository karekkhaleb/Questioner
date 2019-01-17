/* eslint-disable consistent-return */
import database from '../db';

class QuestionController {
  create = (req, res) => {
    const createdQuestion = database.addQuestion(
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
      data: [{
        createdBy: createdQuestion.createdBy,
        meetup: createdQuestion.meetup,
        title: createdQuestion.title,
        body: createdQuestion.body,
      }],
    });
  };

  getAll = (req, res) => {
    res.status(200).json({
      status: 200,
      data: database.questions,
    });
  };

  upVote = (req, res) => {
    const questionId = Number.parseInt(req.params.questionId, 10);
    const userId = Number.parseInt(req.body.userId, 10);
    const upVotedQuestion = database.vote(questionId, userId, 'upvote');
    if (upVotedQuestion && upVotedQuestion.error) {
      return res.status(upVotedQuestion.status).json(upVotedQuestion);
    }
    return res.status(200).json({
      status: 200,
      data: [upVotedQuestion],
    });
  };

  downVote = (req, res) => {
    const questionId = Number.parseInt(req.params.questionId, 10);
    const userId = Number.parseInt(req.body.userId, 10);
    const downVotedQuestion = database.vote(questionId, userId, 'downvote');
    if (downVotedQuestion && downVotedQuestion.error) {
      return res.status(downVotedQuestion.status).json(downVotedQuestion);
    }
    return res.status(200).json({
      status: 200,
      data: [downVotedQuestion],
    });
  }
}

export default new QuestionController();
