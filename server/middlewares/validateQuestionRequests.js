function checkQuestion(req, res, next) {
  const errors = [];
  if (!req.body.title) errors.push('Missing the title for this question');
  if (!req.body.body) errors.push('Missing the body for this question');
  if (Number.isNaN(Number.parseInt(req.params.meetupId, 10))) {
    errors.push('meetup should be an integer');
  }
  req.errors = errors;
  next();
  return true;
}

export default {
  checkQuestion,
};
