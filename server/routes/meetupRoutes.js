import express from 'express';
import meetupController from '../controllers/meetupController';
import { checkMeetup, checkId } from '../middlewares/validateMeetup';
import {
  insureAdmin,
} from '../middlewares/validateRegistered';
import questionValidation from '../middlewares/validateQuestionRequests';
import questionController from '../controllers/questionController';

const { checkQuestion } = questionValidation;

const Router = express.Router();

Router.get('/', meetupController.getAll);
Router.post('/', insureAdmin, checkMeetup, meetupController.create);
Router.get('/upcoming', meetupController.getUpcoming);
Router.get('/:meetupId', meetupController.getSingle);
Router.post('/:meetupId/rsvps', meetupController.respondRsvp);
Router.post('/:meetupId/tags', insureAdmin, meetupController.addTag);
Router.get('/:meetupId/questions', meetupController.getQuestions);
Router.post('/:meetupId/questions', checkQuestion, questionController.create);
Router.post('/:meetupId/images', insureAdmin, checkId, meetupController.addImage);
Router.patch('/:meetupId/topic', insureAdmin, checkId, meetupController.changeTopic);
Router.patch('/:meetupId/date', insureAdmin, checkId, meetupController.changeDate);
Router.patch('/:meetupId/location', insureAdmin, checkId, meetupController.changeLocation);
Router.delete('/:meetupId', insureAdmin, meetupController.delete);

export default Router;
