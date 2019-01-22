/* eslint-disable consistent-return */
import database from '../db';

class QuestionController {
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
