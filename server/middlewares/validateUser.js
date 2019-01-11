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

  // eslint-disable-next-line no-useless-escape
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!emailRegex.test(req.body.email.toLowerCase())) {
    return res.status(400).json({
      status: 400,
      error: 'please enter a valid email address',
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
  if (!req.body.password) {
    return res.status(400).json({
      status: 400,
      error: 'Password is required',
    });
  }
  if (req.body.password.trim().length < 3) {
    return res.status(400).json({
      status: 400,
      error: 'Password should be at least 3 characters',
    });
  }
  next();
}

function checkLoginData(req, res, next) {
  if (!req.body.email) {
    return res.status(400).json({
      status: 400,
      error: 'Please enter email',
    });
  }
  if (!req.body.password) {
    return res.status(400).json({
      status: 400,
      error: 'Please enter password',
    });
  }
  next();
}

export {
  checkSignupData,
  checkLoginData,
};
