import express from 'express';
import questionController from '../controllers/questionController';
import commentController from '../controllers/commentController';
import commentValidation from '../middlewares/validateComment';

const { checkComment } = commentValidation;


const Router = express.Router();

Router.get('/:questionId/comments', questionController.getComments);
Router.patch('/:questionId/upvote', questionController.upVote);
Router.patch('/:questionId/downvote', questionController.downVote);
Router.post('/:questionId/comments', checkComment, commentController.create);


export default Router;
