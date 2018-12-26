/* eslint-disable consistent-return */
import database from '../db';

class MeetupController {
  getAll = (req, res) => {
    res.status(200).json({
      status: 200,
      data: database.meetups,
    });
  };

  create = (req, res) => {
    if (!req.body.location) {
      return res.status(400).json({
        status: 400,
        error: 'Missing location',
      });
    }
    if (!req.body.topic) {
      return res.status(400).json({
        status: 400,
        error: 'Missing topic',
      });
    }
    if (!req.body.happeningOn) {
      return res.status(400).json({
        status: 400,
        error: 'Missing time the meetup takes place',
      });
    }
    const tags = Array.isArray(req.body.tags)?  [...req.body.tags] : [];
    const created = database.addMeetup(
      req.body.location,
      req.body.topic,
      req.body.happeningOn,
      tags,
    );


    res.status(201).json({
      status: 201,
      data: [{
        topic: created.topic,
        location: created.location,
        happeningOn: created.happeningOn,
        tags: created.tags,
      }],
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
      data: {
        meetup: rsvp.meetupId,
        topic: rsvp.meetupTopic,
        status: rsvp.status,
      },
    });
  }
}

export default new MeetupController();
