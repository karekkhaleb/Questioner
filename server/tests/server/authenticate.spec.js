/* eslint-disable no-unused-vars */
import request from 'request';
import server from '../../app';
import {
  admin,
  createMeetup, createQuestion,
  loginAdmin, urlAuth, urlMeetups,
  urlQuestions,
} from './testUtils';

let adminObj;
let meetupObj;
let userToken;
beforeAll(async (Done) => {
  adminObj = await loginAdmin();
  meetupObj = await createMeetup(adminObj.token);
  request.post(`${urlAuth}/signup`, {
    json: {
      firstname: 'regular',
      lastname: 'user',
      email: 'regular@user.com',
      phoneNumber: 25077458965258,
      userName: 'RegUser',
      password: 'testP',
    },
  }, (error, response, body) => {
    userToken = body.data[0].token;
    Done();
  });
});

describe('get comments for a given question', () => {
  it('should give all the comments for the given question', (done) => {
    request.get(`${urlMeetups}`, {
      headers: { token: 'not a valid token' },
    }, (error, response, body) => {
      expect(JSON.parse(body).error).toEqual('Oops, something is wrong with your token');
      done();
    });
  });
  it('should ask to signup or signin if no token is given', (done) => {
    request.get(`${urlMeetups}`, {
    }, (error, response, body) => {
      expect(JSON.parse(body).error).toEqual('please signup or signin');
      done();
    });
  });
  it('should stop regular users from accessing admin only routes', (done) => {
    request.delete(`${urlMeetups}/${meetupObj.id}`, {
      headers: { token: userToken },
    }, (error, response, body) => {
      expect(JSON.parse(body).error).toEqual('only admin has access to this route');
      done();
    });
  });
});
