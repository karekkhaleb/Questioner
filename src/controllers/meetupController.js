/* eslint-disable consistent-return */
import database from '../db';

class MeetupController {
  getAll = async(req, res) => {
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
    const tags = Array.isArray(req.body.tags)?  [...req.body.tags] : [];
    const created = await database.addMeetup({
        location: req.body.location,
        topic: req.body.topic,
        happeningOn: new Date(req.body.happeningOn),
        tags,
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
        topic: created.topic,
        location: created.location,
        happeningOn: created.happeningOn,
        tags: [],
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
      data: [{
        meetup: rsvp.meetupId,
        topic: rsvp.meetupTopic,
        status: rsvp.status,
      }],
    });
  }
}

export default new MeetupController();
