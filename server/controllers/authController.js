import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
import { jwtSecretWord } from '../db';
import User from '../models/user';

class AuthController {
  signup = async (req, res) => {
    const password = bcrypt.hashSync(req.body.password.trim());
    const createdUser = await User.signup({ ...req.body, password });
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
    return true;
  };

  login = async (req, res) => {
    const databaseUser = await User.login(req.body.email);
    if (Array.isArray(databaseUser) && databaseUser.length > 0
      && bcrypt.compareSync(req.body.password, databaseUser[0].password)
    ) {
      const user = {
        id: databaseUser[0].id,
        first_name: databaseUser[0].first_name,
        last_name: databaseUser[0].last_name,
        other_name: databaseUser[0].other_name,
        phone_number: databaseUser[0].phone_number,
        user_name: databaseUser[0].user_name,
        email: databaseUser[0].email,
        registered: databaseUser[0].registered,
        isadmin: databaseUser[0].isadmin,
      };
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
      status: 401,
      error: 'Wrong email or password',
    });
  };
}

export default new AuthController();
