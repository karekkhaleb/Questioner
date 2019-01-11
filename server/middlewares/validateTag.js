/* eslint-disable consistent-return */
function checkTag(req, res, next) {
  const { body } = req;
  if (!body.tagName) {
    return res.status(400).json({
      status: 400,
      error: 'tagName is required',
    });
  }
  next();
}

export default {
  checkTag,
};
