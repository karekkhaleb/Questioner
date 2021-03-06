import request from 'request';
import '../../app';
import {
  loginAdmin, createMeetup, urlMeetups,
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
    request.post(`${urlMeetups}/${meetupObj.id}/questions`, {
      json: {
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
    request.post(`${urlMeetups}/not-a-number/questions`, {
      json: {
        createdBy: adminObj.user.id,
        title: 'test title',
        body: 'test body',
      },
      headers: { token: adminObj.token },
    }, (error, response, body) => {
      expect(body.status).toBe(400);
      expect(body.errors).toContain('meetup should be an integer');
      done();
    });
  });
  it('should ask for the body if absent', (done) => {
    request.post(`${urlMeetups}/${meetupObj.id}/questions`, {
      json: {
        createdBy: adminObj.user.id,
        title: 'test title',
      },
      headers: { token: adminObj.token },
    }, (error, response, body) => {
      expect(body.errors).toContain('Missing the body for this question');
      done();
    });
  });
  it('should ask for the title id if absent', (done) => {
    request.post(`${urlMeetups}/${meetupObj.id}/questions`, {
      json: {
        createdBy: adminObj.user.id,
        body: 'test body',
      },
      headers: { token: adminObj.token },
    }, (error, response, body) => {
      expect(body.errors).toContain('Missing the title for this question');
      done();
    });
  });
  it('should tell if we give an meetup id that does not exist', (done) => {
    request.post(`${urlMeetups}/147852/questions`, {
      json: {
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
});
