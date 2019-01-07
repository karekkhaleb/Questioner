/* eslint-disable consistent-return */
import database from '../db';

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
  }
}

export default new QuestionController();
