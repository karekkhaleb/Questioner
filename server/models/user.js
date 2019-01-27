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
      // return result[0];
      return {
        id: result[0].id,
        first_name: result[0].first_name,
        last_name: result[0].last_name,
        other_name: result[0].other_name,
        phone_number: result[0].phone_number,
        user_name: result[0].user_name,
        email: result[0].email,
        registered: result[0].registered,
        isadin: result[0].isadmin,
      };
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
