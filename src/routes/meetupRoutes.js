import express from 'express';
import meetupController from '../controllers/meetupController';

const Router = express.Router();

Router.get('/', meetupController.getAll);
Router.post('/', meetupController.create);


export default Router;
