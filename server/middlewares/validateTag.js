function checkTag(req, res, next) {
  const { body } = req;
  const errors = [];
  if (!body.tagName) {
    errors.push('tagName is required');
  }
  if (body.tagName && body.tagName.trim() === '') {
    errors.push('tagName should not be an empty string');
  }
  req.errors = errors;
  next();
  return true;
}

export default {
  checkTag,
};
