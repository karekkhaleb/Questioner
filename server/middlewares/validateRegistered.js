/* eslint-disable import/prefer-default-export */
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
  const decoded = jwt.decode(trimmedToken);
  if (!decoded) {
    return res.status(403).json({
      status: 403,
      error: 'Oops, something is wrong with your token',
    });
  }
  req.userData = decoded.user;
  next();
}
function insureAdmin(req, res, next) {
  if (!req.userData.isadmin) {
    return res.status(403).json({
      status: 403,
      error: 'only admin has access to this route',
    });
  }
  next();
}


export {
  insureToken,
  insureAdmin,
};
