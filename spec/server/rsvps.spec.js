/* eslint-disable no-unused-vars */
import request from 'request';
import '@babel/polyfill';
import server from '../../src/app';
import {urlMeetups, testMeetup, urlAuth, urlQuestions} from './testUtils';

describe('respond rsvps api endpoint', () => {
  beforeAll((Done) => {
    request.post(`${urlAuth}/signup`, {
      json: {
        firstname: 'Buhungiro',
        lastname: 'Caleb',
        email: 'karekkhaleb@gmail.com',
        phoneNumber: 250722387998,
        userName: 'zoar',
      },
    },);
    request.post(urlMeetups, {
      json: {
        location: 'Bujumbura',
        topic: 'html',
        happeningOn: '2017-02-05',
        tags: ['advanced'],
      },
    }, );
    Done();
  });
  it('should respond rsvps if everything is right', (done) => {
    request.post(`${urlMeetups}/1/rsvps`, {
      json:{
        status:'yes',
        userId: 1,
      },
    }, (error, response, body) => {
      expect(body.data.status).toEqual('yes');
      done();
    });
  });
  it('this is sample test to make sure the line that generates rsvp id is hit', (done) => {
    request.post(`${urlMeetups}/1/rsvps`, {
      json:{
        status:'maybe',
        userId: 1,
      },
    }, (error, response, body) => {
      expect(body.data.status).toEqual('maybe');
      done();
    });
  });

  it('should ask for status if absent', (done) => {
    request.post(`${urlMeetups}/1/rsvps`, {
      json: {
        userId: 1,
      },
    }, (error, response, body) => {
      expect(body.error).toEqual('status is required');
      done();
    });
  });
  it('should ask for the user id if absent', (done) => {
    request.post(`${urlMeetups}/1/rsvps`, {
      json:{
        status:'yes',
      },
    }, (error, response, body) => {
      expect(body.error).toEqual('userId is required');
      done();
    });
  });
  it('should ask for the right status', (done) => {
    request.post(`${urlMeetups}/1/rsvps`, {
      json:{
        status:'hello',
        userId: 1,
      },
    }, (error, response, body) => {
      expect(body.error).toEqual('status should be yes, no, or maybe');
      done();
    });
  });
  it('should ask for a valid meetup id', (done) => {
    request.post(`${urlMeetups}/not-valid/rsvps`, {
      json:{
        status:'no',
        userId: 1,
      },
    }, (error, response, body) => {
      expect(body.error).toEqual('invalid meetup id');
      done();
    });
  });
  it('should tell if the meetup id we give does not exist', (done) => {
    request.post(`${urlMeetups}/147852/rsvps`, {
      json:{
        status:'no',
        userId: 1,
      },
    }, (error, response, body) => {
      expect(body.error).toEqual('No matching meetup');
      done();
    });
  });
  it('should tell if the user id we give does not exist', (done) => {
    request.post(`${urlMeetups}/1/rsvps`, {
      json:{
        status:'yes',
        userId: 147852,
      },
    }, (error, response, body) => {
      expect(body.error).toEqual('No matching user');
      done();
    });
  });
});
