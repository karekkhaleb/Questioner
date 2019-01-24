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
  return true;
}

function checkId(req, res, next) {
  const meetupId = Number.parseInt(req.params.meetupId, 10);
  if (Number.isNaN(meetupId)) {
    return res.status(400).json({
      status: 400,
      error: 'meetupId should be an integer',
    });
  }
  next();
  return true;
}

export {
  checkMeetup,
  checkId,
};
