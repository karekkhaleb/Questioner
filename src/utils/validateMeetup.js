/* eslint-disable consistent-return */
function checkRsvps(req, res, next) {
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
  next();
}

function checkMeetup(req, res, next) {
  if (!req.body.location) {
    return res.status(400).json({
      status: 400,
      error: 'Missing location',
    });
  }
  if (req.body.location.trim() === '') {
    return res.status(400).json({
      status: 400,
      error: 'Location should not be an empty string',
    });
  }
  if (!req.body.topic) {
    return res.status(400).json({
      status: 400,
      error: 'Missing topic',
    });
  }
  if (req.body.topic.trim() === '') {
    return res.status(400).json({
      status: 400,
      error: 'Topic should not be an empty string',
    });
  }
  if (!req.body.happeningOn) {
    return res.status(400).json({
      status: 400,
      error: 'Missing time the meetup takes place',
    });
  }
  if (new Date(req.body.happeningOn).toString() === 'Invalid Date') {
    return res.status(400).json({
      status: 400,
      error: 'happeningOn should be a valid date: Y/M/D',
    });
  }
  if (new Date(req.body.happeningOn) < new Date()) {
    return res.status(400).json({
      status: 400,
      error: 'happeningOn should not be in the past',
    });
  }
  req.body.topic = req.body.topic.trim();
  req.body.location = req.body.location.trim();
  next();
}

export {
  // eslint-disable-next-line import/prefer-default-export
  checkMeetup,
  checkRsvps,
};
