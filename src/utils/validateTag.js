/* eslint-disable consistent-return */
function checkTag(req, res, next) {
  if (Number.isNaN(Number.parseInt(req.params.meetupId, 10))) {
    return res.status(400).json({
      status: 400,
      error: 'meetupId should be an integer',
    });
  }
  if (!req.body.tagName) {
    return res.status(400).json({
      status: 400,
      error: 'tag name is required',
    });
  }
  if (req.body.tagName.trim() === '') {
    return res.status(400).json({
      status: 400,
      error: 'tag name should not be empty',
    });
  }
  req.body.tagName = req.body.tagName.trim();
  next();
}

export default {
  checkTag,
};
