/* eslint-disable no-unused-vars */
import request from 'request';
import '@babel/polyfill';
import server from '../../src/app';
import { urlMeetups, testMeetup } from './testUtils';

describe('get meetups api endpoint', () => {
  it('should give a proper status code', (done) => {
    request.get(urlMeetups, (error, response, body) => {
      expect(response.statusCode).toEqual(200);
      done();
    });
  });
  it('should give the body with the right status code', (done) => {
    request.get(urlMeetups, (error, response, body) => {
      expect(JSON.parse(body).status).toBe(200);
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
  it('should create the meetup record if all the required fields are available', (done) => {
    request.post(urlMeetups, {
      json: {
        location: testMeetup.location,
        topic: testMeetup.topic,
        happeningOn: testMeetup.happeningOn,
        tags: testMeetup.tags,
      },
    }, (error, response, body) => {
      expect(body.data[0]).toEqual({
        topic: testMeetup.topic,
        location: testMeetup.location,
        happeningOn: testMeetup.happeningOn,
        tags: testMeetup.tags,
      });
      done();
    });
  });
});
