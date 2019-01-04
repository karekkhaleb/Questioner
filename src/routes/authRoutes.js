import express from 'express';
import authController from '../controllers/authController';
import { checkSignupData, checkLoginData } from '../utils/validateUser';

const Router = express.Router();

Router.post('/signup', checkSignupData, authController.signup);
Router.post('/login', checkLoginData, authController.login);


export default Router;
