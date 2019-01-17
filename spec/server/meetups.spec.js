/* eslint-disable no-unused-vars */
import request from 'request';
import '@babel/polyfill';
import server from '../../src/app';
import { urlMeetups, testMeetup } from './testUtils';

describe('get meetups api endpoint', () => {
  it('should give a proper status code', (done) => {
    request.get(urlMeetups, (error, response, body) => {
      expect(Array.isArray(JSON.parse(body).data)).toBeTruthy();
      expect(error).toBeNull();
      expect(response.statusCode).toEqual(200);
      done();
    });
  });
  it('should give an array into the body', (done) => {
    request.get(urlMeetups, (error, response, body) => {
      expect(JSON.parse(body).data.length).toBeDefined();
      done();
    });
  });
});
describe('testing create meetup endpoint', () => {
  it('should ask for meetup location if absent', (done) => {
    request.post(urlMeetups, {
      json: {
        topic: testMeetup.topic,
        happeningOn: testMeetup.happeningOn,
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
      },
    }, (error, response, body) => {
      expect(body.error).toEqual('happeningOn should be a valid date: Y/M/D');
      done();
    });
  });
  it('should not create a meetup in when happening on is in the past', (done) => {
    request.post(urlMeetups, {
      json: {
        location: testMeetup.location,
        topic: testMeetup.topic,
        happeningOn: '2018/01/01',
      },
    }, (error, response, body) => {
      expect(body.error).toEqual('happeningOn should not be in the past');
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
      expect(Array.isArray(body.data)).toBeTruthy();
      done();
    });
  });
});
describe('testing get upcoming meetups api endpoint', () => {
  beforeAll((Done) => {
    request.post(urlMeetups, {
      json: {
        location: testMeetup.location,
        topic: testMeetup.topic,
        happeningOn: testMeetup.happeningOn,
      },
    });
    Done();
  });
  it('should give all upcoming meetups', (done) => {
    request.get(`${urlMeetups}/upcoming`, (error, response, body) => {
      expect(JSON.parse(body).status).toBe(200);
      done();
    });
  });
});
describe('testing get single meetup api endpoint', () => {
  beforeAll((Done) => {
    request.post(urlMeetups, {
      json: {
        location: testMeetup.location,
        topic: testMeetup.topic,
        happeningOn: testMeetup.happeningOn,
      },
    });
    Done();
  });
  it('should give a single meetup', (done) => {
    request.get(`${urlMeetups}/1`, (error, response, body) => {
      expect(JSON.parse(body).status).toBe(200);
      done();
    });
  });
  it('should ask for the right type of the id', (done) => {
    request.get(`${urlMeetups}/wrong-id`, (error, response, body) => {
      expect(JSON.parse(body).error).toEqual('wrong id type');
      done();
    });
  });
  it('should tell the meetup is not present', (done) => {
    request.get(`${urlMeetups}/47854`, (error, response, body) => {
      expect(JSON.parse(body).error).toEqual('No match found');
      done();
    });
  });
});
