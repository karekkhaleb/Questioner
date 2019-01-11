/* eslint-disable no-unused-vars */
import request from 'request';
import server from '../../app';
import {
  createMeetup, createQuestion,
  loginAdmin,
  urlQuestions,
} from './testUtils';

let adminObj;
let meetupObj;
let questionObj;
beforeAll(async (Done) => {
  adminObj = await loginAdmin();
  meetupObj = await createMeetup(adminObj.token);
  questionObj = await createQuestion(meetupObj.id, adminObj.user.id, adminObj.token);
  Done();
});

describe('get comments for a given question', () => {
  it('should give all the comments for the given question', (done) => {
    request.get(`${urlQuestions}/${questionObj.id}/comments`, {
      headers: { token: adminObj.token },
    }, (error, response, body) => {
      expect(Array.isArray(JSON.parse(body).data[0].comments)).toBeTruthy();
      done();
    });
  });
  it('should tell if the questionId given is not a number', (done) => {
    request.get(`${urlQuestions}/not-a-number/comments`, {
      headers: { token: adminObj.token },
    }, (error, response, body) => {
      expect(JSON.parse(body).error).toEqual('questionId is required and should be a number');
      done();
    });
  });
  it('should tell if the questionId given is not found', (done) => {
    request.get(`${urlQuestions}/74125896/comments`, {
      headers: { token: adminObj.token },
    }, (error, response, body) => {
      expect(JSON.parse(body).error).toEqual('Question not found');
      done();
    });
  });
});
