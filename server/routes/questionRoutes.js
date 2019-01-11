import express from 'express';
import questionController from '../controllers/questionController';
import { checkQuestion } from '../middlewares/validateQuestionRequests';

const Router = express.Router();

Router.post('/', checkQuestion, questionController.create);
Router.get('/:questionId/comments', questionController.getComments);
Router.patch('/:questionId/upvote', questionController.upVote);
Router.patch('/:questionId/downvote', questionController.downVote);

export default Router;
