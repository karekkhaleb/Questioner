/* eslint-disable import/prefer-default-export,consistent-return */
function checkQuestion(req, res, next) {
  const errors = [];
  if (!req.body.createdBy) errors.push('Missing the person who created this question');
  if (!req.body.title) errors.push('Missing the title for this question');
  if (!req.body.body) errors.push('Missing the body for this question');
  if (!Number.parseInt(req.body.createdBy, 10)) errors.push('createdBy should be an integer');
  if (Number.isNaN(Number.parseInt(req.params.meetupId, 10))) {
    errors.push('meetup should be an integer');
  }
  req.errors = errors;
  next();
}

export {
  checkQuestion,
};
