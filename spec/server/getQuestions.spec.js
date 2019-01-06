/* eslint-disable no-unused-vars */
import request from 'request';
import server from '../../src/app';
import {
  urlAuth, urlMeetups, urlQuestions,
} from './testUtils';

beforeAll((Done) => {
  request.post(`${urlAuth}/signup`, {
    json: {
      firstname: 'test',
      lastname: 'js',
      email: 'getQuestions@gmail.com',
      phoneNumber: 250755557998,
      userName: 'getQuestions',
      password: 'passquestion',
    },
  });
  request.post(urlMeetups, {
    json: {
      location: 'Bujumbura',
      topic: 'html',
      happeningOn: '2017-02-05',
    },
  });
  request.post(`${urlQuestions}`, {
    json: {
      meetupId: 1,
      createdBy: 1,
      title: 'test title',
      body: 'test body',
    },
  });
  Done();
});

describe('get Questions for a meetup api endpoints', () => {
  it('should give all the questions for the given meetup', (done) => {
    request.get(`${urlMeetups}/1/questions`, (error, response, body) => {
      expect(JSON.parse(body).status).toBe(200);
      done();
    });
  });
  it('tell if the meetup id is not a number', (done) => {
    request.get(`${urlMeetups}/not-a-number/questions`, (error, response, body) => {
      expect(JSON.parse(body).error).toEqual('MeetupId should be a number');
      done();
    });
  });
});
