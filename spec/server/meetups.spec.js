/* eslint-disable no-unused-vars */
import request from 'request';
import server from '../../src/app';
import { urlMeetups, testMeetup } from './testUtils';

// describe('get meetups api endpoint', () => {
//   it('should give a proper status code', (done) => {
//     request.get(urlMeetups, (error, response, body) => {
//       expect(response.statusCode).toEqual(200);
//       done();
//     });
//   });
//   it('should give the body with the right status code', (done) => {
//     request.get(urlMeetups, (error, response, body) => {
//       expect(JSON.parse(body).status).toBe(200);
//       done();
//     });
//   });
//   it('should give an array into the body', (done) => {
//     request.get(urlMeetups, (error, response, body) => {
//       expect(JSON.parse(body).data.length).toBeDefined();
//       done();
//     });
//   });
// });
describe('testing create meetup endpoint', () => {
  it('should ask for meetup location if absent', (done) => {
    request.post(urlMeetups, {
      json: {
        topic: testMeetup.topic,
        happeningOn: testMeetup.happeningOn,
        tags: testMeetup.tags,
      },
    }, (error, response, body) => {
      expect(body.error).toEqual('Missing location');
      done();
    });
  });
  it('should ask for meetup topic if absent', (done) => {
    request.post(urlMeetups, {
      json: {
        location: testMeetup.location,
        happeningOn: testMeetup.happeningOn,
        tags: testMeetup.tags,
      },
    }, (error, response, body) => {
      expect(body.error).toEqual('Missing topic');
      done();
    });
  });
  it('should ask for the date the meetup takes place if absent', (done) => {
    request.post(urlMeetups, {
      json: {
        location: testMeetup.location,
        topic: testMeetup.topic,
        tags: testMeetup.tags,
      },
    }, (error, response, body) => {
      expect(body.error).toEqual('Missing time the meetup takes place');
      done();
    });
  });
  it('should ask for a valid date in the happeningOn field', (done) => {
    request.post(urlMeetups, {
      json: {
        location: testMeetup.location,
        happeningOn: 'not a valid date',
        topic: testMeetup.topic,
        tags: testMeetup.tags,
      },
    }, (error, response, body) => {
      expect(body.error).toEqual('happeningOn should be a valid date: Y/M/D');
      done();
    });
  });
  it('should create the meetup record if all the required fields are available', (done) => {
    request.post(urlMeetups, {
      json: {
        location: testMeetup.location,
        topic: testMeetup.topic,
        happeningOn: testMeetup.happeningOn,
      },
    }, (error, response, body) => {
      expect(body.data[0]).toEqual({
        topic: testMeetup.topic,
        location: testMeetup.location,
        happeningOn: new Date(testMeetup.happeningOn).toISOString(),
        tags: [],
      });
      done();
    });
  });
});
// describe('testing get upcoming meetups api endpoint', () => {
//   beforeAll((Done) => {
//     request.post(urlMeetups, {
//       json: {
//         location: testMeetup.location,
//         topic: testMeetup.topic,
//         happeningOn: testMeetup.happeningOn,
//         tags: testMeetup.tags,
//       },
//     }, );
//     Done();
//   });
//   it('should give all upcoming meetups', function (done) {
//     request.get(`${urlMeetups}/upcoming`, (error, response, body) => {
//       expect(JSON.parse(body).status).toBe(200);
//       done();
//     });
//   });
// });
// describe('testing get single meetup api endpoint', () => {
//   beforeAll((Done) => {
//     request.post(urlMeetups, {
//       json: {
//         location: testMeetup.location,
//         topic: testMeetup.topic,
//         happeningOn: testMeetup.happeningOn,
//       },
//     }, );
//     Done();
//   });
//   it('should give a single meetup', function (done) {
//     request.get(`${urlMeetups}/1`, (error, response, body) => {
//       expect(JSON.parse(body).status).toBe(200);
//       done();
//     });
//   });
//   it('should ask for the right type of the id', function (done) {
//     request.get(`${urlMeetups}/wrong-id`, (error, response, body) => {
//       expect(JSON.parse(body).error).toEqual('wrong id type');
//       done();
//     });
//   });
//   it('should tell the meetup is not present', function (done) {
//     request.get(`${urlMeetups}/47854`, (error, response, body) => {
//       expect(JSON.parse(body).error).toEqual('No match found');
//       done();
//     });
//   });
// });