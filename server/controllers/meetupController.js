/* eslint-disable consistent-return */
import fs from 'fs';
import database from '../db';
import uploadUtilities from '../middlewares/uploadUtilities';

class MeetupController {
  getAll = async (req, res) => {
    const meetups = await database.getAllMeetps();
    if (meetups && meetups.error) {
      return res.status(meetups.status).json({
        status: meetups.status,
        error: meetups.error,
      });
    }
    res.status(200).json({
      status: 200,
      data: meetups,
    });
  };

  create = async (req, res) => {
    if (req.errors.length) {
      return res.status(400).json({
        status: 400,
        errors: req.errors,
      });
    }

    const topic = req.body.topic.trim();
    const location = req.body.location.trim();
    const happeningOn = req.body.happeningOn.trim();

    const created = await database.addMeetup({
      location,
      topic,
      happeningOn,
    });

    if (created && created.error) {
      return res.status(created.status).json({
        status: created.status,
        error: created.error,
      });
    }

    res.status(201).json({
      status: 201,
      data: [{
        id: created.id,
        topic: created.topic,
        location: created.location,
        happeningOn: created.happeningOn,
        tags: [],
        images: [],
      }],
    });
  };

  getSingle = async (req, res) => {
    const meetupId = Number.parseInt(req.params.meetupId, 10);
    if (!meetupId) return res.status(400).json({ status: 400, error: 'wrong id type' });

    const requestedMeetup = await database.getSingleMeetup(meetupId);
    if (requestedMeetup && requestedMeetup.error) {
      return res.status(requestedMeetup.status).json(requestedMeetup);
    }
    return res.status(200).json({
      status: 200,
      data: [requestedMeetup],
    });
  };

  getUpcoming = async (req, res) => {
    const upcomingMeetups = await database.getUpcomingMeetups();
    if (upcomingMeetups && upcomingMeetups.error) {
      return res.status(upcomingMeetups.status).json({
        status: upcomingMeetups.status,
        error: upcomingMeetups.error,
      });
    }
    res.status(200).json({ status: 200, data: upcomingMeetups });
  };

  addTag = async (req, res) => {
    const tagId = Number.parseInt(req.body.tagId, 10);
    const meetupId = Number.parseInt(req.params.meetupId, 10);
    if (Number.isNaN(tagId)) {
      return res.status(400).json({
        status: 400,
        error: 'tagId is required and should be a number',
      });
    }
    if (Number.isNaN(meetupId)) {
      return res.status(400).json({
        status: 400,
        error: 'meetupId should be a number',
      });
    }
    const meetupAndTag = await database.addTagToMeetup(tagId, meetupId);
    if (meetupAndTag && meetupAndTag.error) {
      return res.status(meetupAndTag.status).json(meetupAndTag);
    }
    res.status(200).json({
      status: 200,
      data: meetupAndTag,
    });
  };

  delete = async (req, res) => {
    const meetupId = Number.parseInt(req.params.meetupId, 10);
    if (Number.isNaN(meetupId)) {
      return res.status(400).json({
        status: 400,
        error: 'meetupId is required and should be a number',
      });
    }
    const deletedMeetup = await database.deleteMeetup(meetupId);
    if (deletedMeetup && deletedMeetup.error) {
      return res.status(deletedMeetup.status).json(deletedMeetup);
    }
    res.status(200).json({
      status: 200,
      data: ['Meetup deleted'],
    });
  };

  getQuestions = async (req, res) => {
    const meetupId = Number.parseInt(req.params.meetupId, 10);
    if (Number.isNaN(meetupId)) {
      return res.status(400).json({
        status: 400,
        error: 'MeetupId should be a number',
      });
    }
    const questions = await database.getMeetupQuestions(meetupId);
    if (questions && questions.error) {
      return res.status(questions.status).json(questions);
    }
    res.status(200).json({
      status: 200,
      data: questions,
    });
  };

  respondRsvp = async (req, res) => {
    if (!req.body.status) {
      return res.status(400).json({
        status: 400,
        error: 'status is required',
      });
    }
    if (!Number.parseInt(req.params.meetupId, 10)) {
      return res.status(400).json({
        status: 400,
        error: 'invalid meetup id',
      });
    }
    if (!req.body.userId) {
      return res.status(400).json({
        status: 400,
        error: 'userId is required',
      });
    }
    const status = req.body.status.toString().trim();
    if (status !== 'yes' && status !== 'no' && status !== 'maybe') {
      return res.status(400).json({
        status: 400,
        error: 'status should be yes, no, or maybe',
      });
    }
    const rsvp = await database.respondRsvp({
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
        meetup: rsvp.meetupId,
        topic: rsvp.meetupTopic,
        status: rsvp.status,
      }],
    });
  };

  addImage = async (req, res) => {
    uploadUtilities.upload(req, res, async (err) => {
      if (err && err.message === 'Unexpected field') {
        console.log(err);
        return res.status(400).json({
          status: 400,
          error: 'you should give only one image and its field should be meetupImage',
        });
      } if (err) {
        return res.status(400).json({
          status: 400,
          error: err.message,
        });
      }
      const meetupId = Number.parseInt(req.params.meetupId, 10);
      const imagePath = req.file.path;
      const insertedImage = await database.addImage(meetupId, imagePath);
      if (insertedImage && insertedImage.error) {
        fs.unlinkSync(imagePath);
        return res.status(insertedImage.status).json(insertedImage);
      }
      res.status(201).json({
        status: 201,
        data: [insertedImage],
      });
    });
  };
}

export default new MeetupController();
