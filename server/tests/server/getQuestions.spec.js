import request from 'request';
import '../../app';
import {
  createMeetup, createQuestion,
  loginAdmin,
  urlMeetups,
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

describe('get Questions for a meetup api endpoints', () => {
  it('should give all the questions for the given meetup', (done) => {
    request.get(`${urlMeetups}/${meetupObj.id}/questions`, {
      headers: { token: adminObj.token },
    }, (error, response, body) => {
      expect(JSON.parse(body).status).toBe(200);
      done();
    });
  });
  it('tell if the meetup id is not a number', (done) => {
    request.get(`${urlMeetups}/not-a-number/questions`, {
      headers: { token: adminObj.token },
    }, (error, response, body) => {
      expect(JSON.parse(body).error).toEqual('MeetupId should be a number');
      done();
    });
  });
});
