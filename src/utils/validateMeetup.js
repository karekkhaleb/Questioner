/* eslint-disable consistent-return */
function checkRsvps(req, res, next) {
  const errors = [];
  if (!req.body.status) errors.push('status is required');
  if (!Number.parseInt(req.params.meetupId, 10)) errors.push('invalid meetup id');
  if (!req.body.userId) errors.push('userId is required');
  const status = req.body.status ? req.body.status.toString().trim() : undefined;
  if (status !== 'yes' && status !== 'no' && status !== 'maybe') {
    errors.push('status should be yes, no, or maybe');
  }
  req.errors = errors;
  next();
}

function checkMeetup(req, res, next) {
  const errors = [];
  if (!req.body.location) {
    errors.push('Missing location');
  }
  if (req.body.location && req.body.location.trim() === '') {
    errors.push('Location should not be an empty string');
  }
  if (!req.body.topic) {
    errors.push('Missing topic');
  }
  if (req.body.topic && req.body.topic.trim() === '') {
    errors.push('Topic should not be an empty string');
  }
  if (!req.body.happeningOn) {
    errors.push('Missing time the meetup takes place');
  }
  if (req.body.happeningOn && req.body.happeningOn.trim() === '') {
    errors.push('happeningOn should not be an empty string');
  }
  if (new Date(req.body.happeningOn).toString() === 'Invalid Date') {
    errors.push('happeningOn should be a valid date: Y/M/D');
  }
  if (new Date(req.body.happeningOn) < new Date()) {
    errors.push('happeningOn should not be in the past');
  }
  req.errors = errors;
  next();
}

export {
  // eslint-disable-next-line import/prefer-default-export
  checkMeetup,
  checkRsvps,
};
