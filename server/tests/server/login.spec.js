import request from 'request';
import '../../app';
import { urlAuth } from './testUtils';

beforeAll(async (DONE) => {
  await request.post(`${urlAuth}/signup`, {
    json: {
      firstname: 'firstname',
      lastname: 'lastname',
      email: 'login@gmail.com',
      phoneNumber: 250722387998,
      userName: 'loginUser',
      password: 'testpassword',
    },
  });
  DONE();
});

describe('login api endpoint', () => {
  it('should ask for the email if absent', (done) => {
    request.post(`${urlAuth}/login`, {
      json: {
        password: 'testpassword',
      },
    }, (error, response, body) => {
      expect(body.error).toEqual('Please enter email');
      done();
    });
  });
  it('should ask for the password if absent', (done) => {
    request.post(`${urlAuth}/login`, {
      json: {
        email: 'login@gmail.com',
      },
    }, (error, response, body) => {
      expect(body.error).toEqual('Please enter password');
      done();
    });
  });
  it('should tell if we give wrong email or password', (done) => {
    request.post(`${urlAuth}/login`, {
      json: {
        email: 'null@test.com',
        password: 'fail',
      },
    }, (error, response, body) => {
      expect(body.status).toBe(401);
      expect(body.error).toEqual('Wrong email or password');
      done();
    });
  });
  it('should log in the user if everything is fine', (done) => {
    request.post(`${urlAuth}/login`, {
      json: {
        email: 'login@gmail.com',
        password: 'testpassword',
      },
    }, (error, response, body) => {
      expect(body.data[0].token).toBeDefined();
      done();
    });
  });
});
