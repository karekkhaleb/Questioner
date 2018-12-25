import express from 'express';
import meetupController from '../controllers/meetupController';

const Router = express.Router();

Router.get('/', meetupController.getAll);
Router.post('/', meetupController.create);
Router.get('/upcoming', meetupController.getUpcoming);
Router.get('/:meetupId', meetupController.getSingle);
Router.post('/:meetupId/rsvps', meetupController.respondRsvp);

export default Router;
