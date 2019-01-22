/* eslint-disable consistent-return */
function checkTag(req, res, next) {
  const errors = [];
  if (Number.isNaN(Number.parseInt(req.params.meetupId, 10))) {
    errors.push('meetupId should be an integer');
  }
  if (!req.body.tagName) errors.push('tag name is required');
  if (req.body.tagName && req.body.tagName.trim() === '') {
    errors.push('tag name should not be empty');
  }
  req.errors = errors;
  next();
}

export default {
  checkTag,
};
