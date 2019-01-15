/* eslint-disable no-unused-vars */
import request from 'request';
// noinspection ES6CheckImport
import server from '../../src/app';
import {
  urlAuth, urlMeetups, urlQuestions,
} from './testUtils';

describe('upvote and downvote api endpoint', () => {
  beforeAll((Done) => {
    request.post(`${urlAuth}/signup`, {
      json: {
        firstname: 'Buhungiro',
        lastname: 'Caleb',
        email: 'karekkhaleb@gmail.com',
        phoneNumber: 250722387998,
        userName: 'zoar',
      },
    });
    request.post(urlMeetups, {
      json: {
        location: 'Bujumbura',
        topic: 'html',
        happeningOn: '2017-02-05',
        tags: ['advanced'],
      },
    });
    // create a question before voting
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
  describe('upvote question api endpoint', () => {
    it('should upvote a question if question id given exists', (done) => {
      request.patch(`${urlQuestions}/1/upvote`, (error, response, body) => {
        expect(Object.getOwnPropertyNames(JSON.parse(body).data[0])).toContain('votes');
        done();
      });
    });
    it('should tell if the question we try to upvote does not exists', (done) => {
      request.patch(`${urlQuestions}/1147852/upvote`, (error, response, body) => {
        expect(JSON.parse(body).error).toEqual('No question matches that id');
        done();
      });
    });
  });

  describe('downvote question api endpoint', () => {
    it('should downvote a question if question id given exists', (done) => {
      request.patch(`${urlQuestions}/1/downvote`, (error, response, body) => {
        expect(Object.getOwnPropertyNames(JSON.parse(body).data[0])).toContain('votes');
        done();
      });
    });
  });
  it('should tell if the question we try to downvote does not exists', (done) => {
    request.patch(`${urlQuestions}/8748585/downvote`, (error, response, body) => {
      expect(JSON.parse(body).error).toEqual('No question matches that id');
      done();
    });
  });
});
