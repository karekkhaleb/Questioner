/* eslint-disable import/prefer-default-export,consistent-return */
function checkQuestion(req, res, next) {
  if (!req.body.createdBy) {
    return res.status(400).json({
      status: 400,
      error: 'Missing the person who created this question',
    });
  }
  if (!req.body.title) {
    return res.status(400).json({
      status: 400,
      error: 'Missing the title for this question',
    });
  }
  if (!req.body.body) {
    return res.status(400).json({
      status: 400,
      error: 'Missing the body for this question',
    });
  }
  if (!Number.parseInt(req.body.createdBy, 10)) {
    return res.status(400).json({
      status: 400,
      error: 'createdBy should be an integer',
    });
  }
  if (!Number.parseInt(req.body.meetupId, 10)) {
    return res.status(400).json({
      status: 400,
      error: 'meetup should be an integer',
    });
  }
  next();
}

export {
  checkQuestion,
};
