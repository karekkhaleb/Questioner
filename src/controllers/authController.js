/* eslint-disable consistent-return */
import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
import database from '../db';

class AuthController {
  signup = async (req, res) => {
    const password = bcrypt.hashSync(req.body.password.trim());
    const createdUser = await database.signup({ ...req.body, password });
    if (createdUser && createdUser.error) {
      return res.status(createdUser.status).json(createdUser);
    }
    const token = jwt.sign({
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
      data: createdUser,
    }, 'Top-Secret');
    res.status(201).json({
      status: 201,
      data: [{
        token,
        user: createdUser,
      }],
    });
  };
}

export default new AuthController();
