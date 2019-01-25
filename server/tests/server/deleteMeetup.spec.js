import request from 'request';
import '../../app';
import {
  createMeetup,
  loginAdmin, urlMeetups,
} from './testUtils';

let adminObj;
let meetupObj;
beforeAll(async (Done) => {
  adminObj = await loginAdmin();
  meetupObj = await createMeetup(adminObj.token);
  Done();
});

describe('delete meetup api endpoint', () => {
  it('should delete a meetup', (done) => {
    request.delete(`${urlMeetups}/${meetupObj.id}`, {
      headers: { token: adminObj.token },
    }, (error, response, body) => {
      expect(JSON.parse(body).data[0].message).toEqual('Meetup deleted');
      done();
    });
  });
  it('should not delete a meetup that does not exist', (done) => {
    request.delete(`${urlMeetups}/147852`, {
      headers: { token: adminObj.token },
    }, (error, response, body) => {
      expect(JSON.parse(body).error).toEqual('Meetup not found');
      done();
    });
  });
});
