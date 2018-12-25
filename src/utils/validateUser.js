/* eslint-disable consistent-return,import/prefer-default-export */
function checkSignupData(req, res, next) {
  if (!req.body.firstname) {
    return res.status(400).json({
      status: 400,
      error: 'Firstname is required',
    });
  }
  if (!req.body.lastname) {
    return res.status(400).json({
      status: 400,
      error: 'Lastname is required',
    });
  }
  if (!req.body.email) {
    return res.status(400).json({
      status: 400,
      error: 'Email is required',
    });
  }
  if (!req.body.phoneNumber) {
    return res.status(400).json({
      status: 400,
      error: 'PhoneNumber is required',
    });
  }
  if (!req.body.userName) {
    return res.status(400).json({
      status: 400,
      error: 'UserName is required',
    });
  }
  if (!Number.parseInt(req.body.phoneNumber, 10)) {
    return res.status(400).json({
      status: 400,
      error: 'Phone Number should be a number',
    });
  }
  next();
}

export {
  checkSignupData,
};
