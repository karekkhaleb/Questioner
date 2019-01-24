import jwt from 'jsonwebtoken';

function insureToken(req, res, next) {
  const { token } = req.headers;
  if (typeof token === 'undefined') {
    return res.status(403).json({
      status: 403,
      error: 'please signup or signin',
    });
  }
  const trimmedToken = token.trim();
  try {
    const signed = jwt.verify(trimmedToken, process.env.JWTSECRETWORD);
    req.userData = signed.user;
  } catch (e) {
    if (e.message === 'jwt expired') {
      return res.status(403).json({
        status: 403,
        error: 'token expired, please login again',
      });
    }
    if (e.message === 'invalid token') {
      return res.status(403).json({
        status: 403,
        error: 'token expired, please login again',
      });
    }
    return res.status(403).json({
      status: 403,
      error: 'Oops, something is wrong with your token',
    });
  }
  next();
  return true;
}
function insureAdmin(req, res, next) {
  if (!req.userData.isadmin) {
    return res.status(403).json({
      status: 403,
      error: 'only admin has access to this route',
    });
  }
  next();
  return true;
}


export {
  insureToken,
  insureAdmin,
};
