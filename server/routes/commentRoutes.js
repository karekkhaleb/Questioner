import express from 'express';
import commentController from '../controllers/commentController';
import commentValidation from '../middlewares/validateComment';

const { checkComment } = commentValidation;

const Router = express.Router();

Router.post('/', checkComment, commentController.create);


export default Router;
