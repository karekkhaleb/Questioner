function checkMeetup(req, res, next) {
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
  if (new Date(req.body.happeningOn).toString() === 'Invalid Date') {
    return res.status(400).json({
      status: 400,
      error: 'happeningOn should be a valid date: Y/M/D',
    });
  }
  next();
}

export {
  checkMeetup,
}