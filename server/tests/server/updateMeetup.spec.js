import request from 'request';
import '../../app';
import {
  createMeetup,
  loginAdmin, urlMeetups,
} from './testUtils';

let adminObj;
let meetupObj1;
let meetupObj2;
let meetupObj3;
beforeAll(async (Done) => {
  adminObj = await loginAdmin();
  meetupObj1 = await createMeetup(adminObj.token);
  meetupObj2 = await createMeetup(adminObj.token);
  meetupObj3 = await createMeetup(adminObj.token);
  Done();
});

describe('update meetup location', () => {
  it('should update the location of a meetup', (done) => {
    request.patch(`${urlMeetups}/${meetupObj1.id}/location`, {
      headers: { token: adminObj.token },
      json: { location: 'busogo' },
    }, (error, response, body) => {
      expect(body.data[0].location).toEqual('busogo');
      done();
    });
  });
});
describe('update meetup topic', () => {
  it('should update the topic of a meetup', (done) => {
    request.patch(`${urlMeetups}/${meetupObj2.id}/topic`, {
      headers: { token: adminObj.token },
      json: { topic: 'vuetest' },
    }, (error, response, body) => {
      expect(body.data[0].topic).toEqual('vuetest');
      done();
    });
  });
});
describe('update meetup due date topic', () => {
  it('should update the date of a meetup', (done) => {
    request.patch(`${urlMeetups}/${meetupObj3.id}/date`, {
      headers: { token: adminObj.token },
      json: { happeningOn: '2020-02-02' },
    }, (error, response, body) => {
      expect(body.data[0].happening_on.substr(0, 4)).toEqual('2020');
      done();
    });
  });
});
