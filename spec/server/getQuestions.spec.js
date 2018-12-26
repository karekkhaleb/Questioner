/* eslint-disable no-unused-vars */
import request from 'request';
import server from '../../src/app';
import {
  urlAuth, testMeetup, testUser, urlMeetups, urlQuestions
} from './testUtils';

describe('get Questions api endpoints', () => {
  let question;
  beforeAll((Done) => {
    request.post(`${urlAuth}/signup`, {
      json: {
        firstname: 'test',
        lastname: 'js',
        email: 'karecaleb@gmail.com',
        phoneNumber: 250755557998,
        userName: 'testjs',
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
    // create a question before voting
    request.post(`${urlQuestions}`, {
      json: {
        meetupId: 1,
        createdBy: 1,
        title: 'test title',
        body: 'test body',
      }
    }, );
    Done();
  });
  describe('testing the get all questions api endpoint', () => {
    it('should give all the questions' , (done) => {
      request.get(`${urlQuestions}`, (error, response, body) => {
        expect(JSON.parse(body).status).toBe(200);
        done();
      });
    });
  });
});
