/* eslint-disable no-unused-vars */
import request from 'request';
import server from '../../src/app';
import { urlAuth } from './testUtils';

beforeAll((DONE) => {
  request.post(`${urlAuth}/signup`, {
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
});
