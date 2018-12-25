import express from 'express';
import authController from '../controllers/authController';
// import { checkQuestion } from '../utils/validateQuestionRequests';
import { checkSignupData } from '../utils/validateUser';

const Router = express.Router();

Router.post('/signup', checkSignupData, authController.signup);


export default Router;
