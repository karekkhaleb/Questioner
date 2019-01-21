/* eslint-disable consistent-return */
import database from '../db';

class MeetupController {
  getAll = (req, res) => {
    const allMeetups = database.getAllMeetups();
    res.status(200).json({
      status: 200,
      data: allMeetups,
    });
  };

  create = (req, res) => {
    if (req.errors.length) {
      return res.status(400).json({
        status: 400,
        errors: req.errors,
      });
    }

    const topic = req.body.topic.trim();
    const location = req.body.location.trim();
    const happeningOn = req.body.happeningOn.trim();
    const created = database.addMeetup({
      location,
      topic,
      happeningOn,
    });

    res.status(201).json({
      status: 201,
      data: [created],
    });
  };

  getSingle = (req, res) => {
    const meetupId = Number.parseInt(req.params.meetupId, 10);
    if (!meetupId) return res.status(400).json({ status: 400, error: 'wrong id type' });

    const requestedMeetup = database.getSingleMeetup(meetupId);
    if (requestedMeetup) {
      return res.status(200).json({
        status: 200,
        data: [{
          id: requestedMeetup.id,
          topic: requestedMeetup.topic,
          location: requestedMeetup.location,
          happeningOn: requestedMeetup.happeningOn,
          tags: requestedMeetup.tags,
          questions: requestedMeetup.questions,
        }],
      });
    }
    return res.status(404).json({
      status: 404,
      error: 'No match found',
    });
  };

  getUpcoming = (req, res) => {
    const upcomingMeetups = database.getUpcomingMeetups();
    res.status(200).json({ status: 200, data: upcomingMeetups });
  };

  respondRsvp = (req, res) => {
    if (req.errors.length) {
      return res.status(400).json({
        status: 400,
        errors: req.errors,
      });
    }
    const status = req.body.status.toString().trim();
    const rsvp = database.respondRsvp({
      status,
      userId: Number.parseInt(req.body.userId, 10),
      meetupId: Number.parseInt(req.params.meetupId, 10),
    });

    if (rsvp && rsvp.error) {
      return res.status(rsvp.status).json({
        status: rsvp.status,
        error: rsvp.error,
      });
    }

    res.status(200).json({
      status: 200,
      data: [{
        id: rsvp.id,
        meetup: rsvp.meetupId,
        topic: rsvp.meetupTopic,
        status: rsvp.status,
      }],
    });
  };

  addTag = (req, res) => {
    const addedTag = database.addTag(Number.parseInt(req.params.meetupId, 10), req.body.tagName);
    if (addedTag.error) {
      return res.status(addedTag.status).json(addedTag);
    }
    return res.status(200).json({
      status: 200,
      data: [addedTag],
    });
  };

  addQuestion = (req, res) => {
    if (req.errors.length) {
      return res.status(400).json({
        status: 400,
        errors: req.errors,
      });
    }
    const createdQuestion = database.addQuestion(
      Number.parseInt(req.params.meetupId, 10),
      Number.parseInt(req.body.createdBy, 10),
      req.body.title,
      req.body.body,
    );

    if (createdQuestion && createdQuestion.error) {
      return res.status(createdQuestion.status).json({
        status: createdQuestion.status,
        error: createdQuestion.error,
      });
    }
    res.status(201).json({
      status: 201,
      data: [{
        id: createdQuestion.id,
        createdBy: createdQuestion.createdBy,
        meetup: createdQuestion.meetup,
        title: createdQuestion.title,
        body: createdQuestion.body,
      }],
    });
  };

  getQuestions = (req, res) => {
    const meetupId = Number.parseInt(req.params.meetupId, 10);
    if (Number.isNaN(meetupId)) {
      return res.status(400).json({
        status: 400,
        error: 'meetupId should be an integer',
      });
    }
    const questions = database.getMeetupQuestions(meetupId);
    if (questions.error) {
      return res.status(questions.status).json(questions);
    }
    res.status(200).json({
      status: 200,
      data: questions,
    });
  }
}

export default new MeetupController();
