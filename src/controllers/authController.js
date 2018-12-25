/* eslint-disable consistent-return */
import database from '../db';

class AuthController {
  signup = (req, res) => {
    const createdUser = database.signup(req.body);
    res.status(201).json({
      status: 201,
      data: createdUser,
    });
  };
}

export default new AuthController();
