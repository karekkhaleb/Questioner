import dbUtils from '../db/utils';
import { executeQuery } from '../db';

const { databaseErrorObj } = dbUtils;

export default class User {
  static signup = async (userCredentials) => {
    const userParams = [
      userCredentials.firstname,
      userCredentials.lastname,
      userCredentials.othername ? userCredentials.othername : '',
      userCredentials.password,
      Number.parseInt(userCredentials.phoneNumber, 10),
      userCredentials.userName,
      userCredentials.email,
    ];
    const query = `insert into users(
      first_name, 
      last_name, 
      other_name, 
      password, 
      phone_number, 
      user_name, 
      email)
        VALUES(
          $1, $2, $3, $4, $5, $6, $7
        ) returning *;
    `;
    try {
      const result = await executeQuery(query, userParams);
      return result[0];
    } catch (e) {
      if (e.detail === `Key (user_name)=(${userCredentials.userName}) already exists.`) {
        return {
          status: 409,
          error: 'userName already taken, please choose another one',
        };
      }
      if (e.detail === `Key (email)=(${userCredentials.email}) already exists.`) {
        return {
          status: 409,
          error: 'Email already taken, please chose another one',
        };
      }
      return databaseErrorObj;
    }
  };

  static login = async (email) => {
    const query = 'select * from users where email = $1 ; ';
    try {
      return await executeQuery(query, [email]);
    } catch (e) {
      return databaseErrorObj;
    }
  };
}
