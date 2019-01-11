import express from 'express';
import commentController from '../controllers/commentController';
import { checkComment } from '../middlewares/validateComment';

const Router = express.Router();

Router.post('/', checkComment, commentController.create);


export default Router;
