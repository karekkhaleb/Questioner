/* eslint-disable no-unused-vars */
import request from 'request';
import server from '../../app';
import {
  urlQuestions, loginAdmin, createMeetup,
} from './testUtils';

let adminObj;
let meetupObj;
beforeAll(async (Done) => {
  adminObj = await loginAdmin();
  meetupObj = await createMeetup(adminObj.token);
  Done();
});
describe('create question api endpoint', () => {
  it(`should create the question if the user and meetup are
     already present and we give all required fields`, (done) => {
    request.post(`${urlQuestions}`, {
      json: {
        meetupId: meetupObj.id,
        createdBy: adminObj.user.id,
        title: 'test title',
        body: 'test body',
      },
      headers: { token: adminObj.token },
    }, (error, response, body) => {
      expect(Object.keys(body.data[0])).toContain('title');
      done();
    });
  });
  it('should ask to give the meetup id as a number', (done) => {
    request.post(`${urlQuestions}`, {
      json: {
        meetupId: 'not a number',
        createdBy: adminObj.user.id,
        title: 'test title',
        body: 'test body',
      },
      headers: { token: adminObj.token },
    }, (error, response, body) => {
      expect(body.error).toEqual('meetup should be an integer');
      done();
    });
  });
  it('should ask to give the user id as a number', (done) => {
    request.post(`${urlQuestions}`, {
      json: {
        meetupId: meetupObj.id,
        createdBy: 'not a number',
        title: 'test title',
        body: 'test body',
      },
      headers: { token: adminObj.token },
    }, (error, response, body) => {
      expect(body.error).toEqual('createdBy should be an integer');
      done();
    });
  });
  it('should ask for the body if absent', (done) => {
    request.post(`${urlQuestions}`, {
      json: {
        meetupId: meetupObj.id,
        createdBy: adminObj.user.id,
        title: 'test title',
      },
      headers: { token: adminObj.token },
    }, (error, response, body) => {
      expect(body.error).toEqual('Missing the body for this question');
      done();
    });
  });
  it('should ask for the title id if absent', (done) => {
    request.post(`${urlQuestions}`, {
      json: {
        meetupId: meetupObj.id,
        createdBy: adminObj.user.id,
        body: 'test body',
      },
      headers: { token: adminObj.token },
    }, (error, response, body) => {
      expect(body.error).toEqual('Missing the title for this question');
      done();
    });
  });
  it('should ask for the user\'s id if absent', (done) => {
    request.post(`${urlQuestions}`, {
      json: {
        meetupId: meetupObj.id,
        title: 'test title',
        body: 'test body',
      },
      headers: { token: adminObj.token },
    }, (error, response, body) => {
      expect(body.error).toEqual('Missing the person who created this question');
      done();
    });
  });
  it('should ask for the meetup id if absent', (done) => {
    request.post(`${urlQuestions}`, {
      json: {
        createdBy: adminObj.user.id,
        title: 'test title',
        body: 'test body',
      },
      headers: { token: adminObj.token },
    }, (error, response, body) => {
      expect(body.error).toEqual('Missing meetup');
      done();
    });
  });
  it('should tell if we give an meetup id that does not exist', (done) => {
    request.post(`${urlQuestions}`, {
      json: {
        meetupId: 8798745,
        createdBy: adminObj.user.id,
        title: 'test title',
        body: 'test body',
      },
      headers: { token: adminObj.token },
    }, (error, response, body) => {
      expect(body.error).toEqual('Meetup not found');
      done();
    });
  });
  it('should tell if we give an user id that does not exist', (done) => {
    request.post(`${urlQuestions}`, {
      json: {
        meetupId: meetupObj.id,
        createdBy: 8798745,
        title: 'test title',
        body: 'test body',
      },
      headers: { token: adminObj.token },
    }, (error, response, body) => {
      expect(body.error).toEqual('User creating question not found');
      done();
    });
  });
});
