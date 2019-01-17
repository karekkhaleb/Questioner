import express from 'express';
import questionController from '../controllers/questionController';

const Router = express.Router();

Router.patch('/:questionId/upvote', questionController.upVote);
Router.patch('/:questionId/downvote', questionController.downVote);

export default Router;
