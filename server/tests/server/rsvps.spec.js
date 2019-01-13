/* eslint-disable no-unused-vars */
import request from 'request';
import server from '../../app';
import {
  urlMeetups, loginAdmin, createMeetup,
} from './testUtils';

let adminObj;
let meetupObj;
let meetupObj1;
beforeAll(async (Done) => {
  adminObj = await loginAdmin();
  meetupObj = await createMeetup(adminObj.token);
  meetupObj1 = await createMeetup(adminObj.token);
  // responding rsvp ahead of time to test what happens if the meetup is already responded to
  await request.post(`${urlMeetups}/${meetupObj1.id}/rsvps`, {
    json: {
      status: 'yes',
      userId: adminObj.user.id,
    },
    headers: { token: adminObj.token },
  });
  Done();
});

describe('respond rsvps api endpoint', () => {
  it('should respond rsvps if everything is right', (done) => {
    request.post(`${urlMeetups}/${meetupObj.id}/rsvps`, {
      json: {
        status: 'yes',
        userId: adminObj.user.id,
      },
      headers: { token: adminObj.token },
    }, (error, response, body) => {
      expect(body.data[0].status).toEqual('yes');
      done();
    });
  });

  it('should not respond twice to a single meetup', (done) => {
    request.post(`${urlMeetups}/${meetupObj1.id}/rsvps`, {
      json: {
        status: 'no',
        userId: adminObj.user.id,
      },
      headers: { token: adminObj.token },
    }, (error, response, body) => {
      expect(body.error).toEqual('User already responded to this meetup');
      done();
    });
  });

  it('should ask for status if absent', (done) => {
    request.post(`${urlMeetups}/${meetupObj.id}/rsvps`, {
      json: {
        userId: adminObj.user.id,
      },
      headers: { token: adminObj.token },
    }, (error, response, body) => {
      expect(body.error).toEqual('status is required');
      done();
    });
  });
  it('should ask for the user id if absent', (done) => {
    request.post(`${urlMeetups}/${meetupObj.id}/rsvps`, {
      json: {
        status: 'yes',
      },
      headers: { token: adminObj.token },
    }, (error, response, body) => {
      expect(body.error).toEqual('userId is required');
      done();
    });
  });
  it('should ask for the right status', (done) => {
    request.post(`${urlMeetups}/1/rsvps`, {
      json: {
        status: 'hello',
        userId: adminObj.user.id,
      },
      headers: { token: adminObj.token },
    }, (error, response, body) => {
      expect(body.error).toEqual('status should be yes, no, or maybe');
      done();
    });
  });
  it('should ask for a valid meetup id', (done) => {
    request.post(`${urlMeetups}/not-valid/rsvps`, {
      json: {
        status: 'no',
        userId: adminObj.user.id,
      },
      headers: { token: adminObj.token },
    }, (error, response, body) => {
      expect(body.error).toEqual('invalid meetup id');
      done();
    });
  });
  it('should tell if the meetup id we give does not exist', (done) => {
    request.post(`${urlMeetups}/147852/rsvps`, {
      json: {
        status: 'no',
        userId: adminObj.user.id,
      },
      headers: { token: adminObj.token },
    }, (error, response, body) => {
      expect(body.error).toEqual('Meetup not available');
      done();
    });
  });
  it('should tell if the user id we give does not exist', (done) => {
    request.post(`${urlMeetups}/${meetupObj.id}/rsvps`, {
      json: {
        status: 'yes',
        userId: 147852,
      },
      headers: { token: adminObj.token },
    }, (error, response, body) => {
      expect(body.error).toEqual('User not available');
      done();
    });
  });
});
