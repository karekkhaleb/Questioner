/* eslint-disable consistent-return */
import Question from '../models/question';

class QuestionController {
  create = async (req, res) => {
    const createdQuestion = await Question.addQuestion(
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
    const upVotedQuestion = await Question.vote(questionId, 'upvote');
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
    const downVotedQuestion = await Question.vote(questionId, 'downvote');
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
    const questionComments = await Question.getComments(questionId);
    if (questionComments && questionComments.error) {
      return res.status(questionComments.status).json(questionComments);
    }
    if (questionComments.length === 0) {
      return res.status(404).json({
        status: 404,
        error: 'Question not found',
      });
    }
    return res.status(200).json({
      status: 200,
      data: [{
        questionId,
        questionTitle: questionComments[0].title,
        questionBody: questionComments[0].body,
        comments: questionComments[0].comments,
      }],
    });
  }
}

export default new QuestionController();
