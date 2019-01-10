import express from 'express';
import meetupController from '../controllers/meetupController';
import { checkMeetup, checkId } from '../utils/validateMeetup';

const Router = express.Router();

Router.get('/', meetupController.getAll);
Router.post('/', checkMeetup, meetupController.create);
Router.get('/upcoming', meetupController.getUpcoming);
Router.get('/:meetupId', meetupController.getSingle);
Router.post('/:meetupId/rsvps', meetupController.respondRsvp);
Router.post('/:meetupId/tags', meetupController.addTag);
Router.get('/:meetupId/questions', meetupController.getQuestions);
Router.post('/:meetupId/images', checkId, meetupController.addImage);
Router.delete('/:meetupId', meetupController.delete);

export default Router;
