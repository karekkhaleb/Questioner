import express from 'express';
import questionController from '../controllers/questionController';
import { checkQuestion } from '../utils/validateQuestionRequests';

const Router = express.Router();

Router.post('/', checkQuestion, questionController.create);
Router.get('/', questionController.getAll);


export default Router;
