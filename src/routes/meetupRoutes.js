import express from 'express';
import meetupController from '../controllers/meetupController';
import { checkMeetup } from '../utils/validateMeetup';

const Router = express.Router();

Router.get('/', meetupController.getAll);
Router.post('/', checkMeetup, meetupController.create);
Router.get('/upcoming', meetupController.getUpcoming);
Router.get('/:meetupId', meetupController.getSingle);
Router.post('/:meetupId/rsvps', meetupController.respondRsvp);
Router.post('/:meetupId/tags', meetupController.addTag);

export default Router;
