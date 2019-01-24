function checkComment(req, res, next) {
  if (!req.body.questionId) {
    return res.status(400).json({
      status: 400,
      error: 'Missing questionId',
    });
  }
  if (!req.body.userId) {
    return res.status(400).json({
      status: 400,
      error: 'Missing userId',
    });
  }
  if (!req.body.comment) {
    return res.status(400).json({
      status: 400,
      error: 'Missing the comment',
    });
  }
  if (!Number.parseInt(req.body.userId, 10)) {
    return res.status(400).json({
      status: 400,
      error: 'userId should be an integer',
    });
  }
  if (!Number.parseInt(req.body.questionId, 10)) {
    return res.status(400).json({
      status: 400,
      error: 'questionId should be an integer',
    });
  }
  next();
  return true;
}

export default {
  checkComment,
};
