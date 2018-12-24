import express from 'express';
import meetupController from '../controllers/meetupController';

const Router = express.Router();

Router.post('/', meetupController.create);


export default Router;
