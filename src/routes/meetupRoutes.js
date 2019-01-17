import express from 'express';
import meetupController from '../controllers/meetupController';
import { checkMeetup, checkRsvps } from '../utils/validateMeetup';
import { checkQuestion } from '../utils/validateQuestionRequests';
import validateTag from '../utils/validateTag';

const Router = express.Router();

Router.get('/', meetupController.getAll);
Router.post('/', checkMeetup, meetupController.create);
Router.get('/upcoming', meetupController.getUpcoming);
Router.get('/:meetupId', meetupController.getSingle);
Router.post('/:meetupId/questions', checkQuestion, meetupController.addQuestion);
Router.post('/:meetupId/rsvps', checkRsvps, meetupController.respondRsvp);
Router.post('/:meetupId/tags', validateTag.checkTag, meetupController.addTag);

export default Router;
