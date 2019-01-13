/* eslint-disable no-unused-vars */
import request from 'request';
import server from '../../app';
import {
  urlRoot, loginAdmin, createMeetup, createQuestion, urlMeetups,
} from './testUtils';

let adminObj;
let meetupObj;
let meetupObj1;
let questionObj;
beforeAll(async (Done) => {
  adminObj = await loginAdmin();
  meetupObj = await createMeetup(adminObj.token);
  meetupObj1 = await createMeetup(adminObj.token);
  questionObj = await createQuestion(meetupObj.id, adminObj.user.id, adminObj.token);
  Done();
});

describe('Delete meetup endpoint', () => {
  it('should delete a meetup that exists', (done) => {
    request.delete(`${urlMeetups}/${meetupObj.id}`, {
      headers: {
        token: adminObj.token,
      },
    }, (error, response, body) => {
      expect(JSON.parse(body).data[0].message).toEqual('Meetup deleted');
      done();
    });
  });
  it('should tell if the meetup given does not exist', (done) => {
    request.delete(`${urlMeetups}/478547`, {
      headers: {
        token: adminObj.token,
      },
    }, (error, response, body) => {
      expect(JSON.parse(body).error).toEqual('Meetup not found');
      done();
    });
  });
});
