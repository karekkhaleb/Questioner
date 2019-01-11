/* eslint-disable consistent-return */
import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
import database, { jwtSecretWord } from '../db';

class AuthController {
  signup = async (req, res) => {
    const password = bcrypt.hashSync(req.body.password.trim());
    const createdUser = await database.signup({ ...req.body, password });
    if (createdUser && createdUser.error) {
      return res.status(createdUser.status).json(createdUser);
    }
    const token = jwt.sign({
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
      user: createdUser,
    }, jwtSecretWord);
    res.status(201).json({
      status: 201,
      data: [{
        token,
        user: createdUser,
      }],
    });
  };

  login = async (req, res) => {
    const databaseUser = await database.login(req.body.email);
    if (Array.isArray(databaseUser) && databaseUser.length > 0
      && bcrypt.compareSync(req.body.password, databaseUser[0].password)
    ) {
      const user = databaseUser[0];
      const token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        user,
      }, jwtSecretWord);
      return res.status(200).json({
        status: 200,
        data: [{
          token,
          user,
        }],
      });
    }
    if (databaseUser && databaseUser.error) {
      return res.status(databaseUser.status).json(databaseUser);
    }
    return res.status(400).json({
      status: 400,
      error: 'Wrong email or password',
    });
  };
}

export default new AuthController();
