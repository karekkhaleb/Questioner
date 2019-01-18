/* eslint-disable no-unused-vars */
import request from 'request';
// noinspection ES6CheckImport
import server from '../../src/app';
import {
  urlAuth, urlMeetups, urlQuestions,
} from './testUtils';

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
describe('upvote and downvote api endpoint', () => {
  describe('upvote question api endpoint', () => {
    it('should upvote a question if question id given exists', (done) => {
      request.patch(`${urlQuestions}/1/upvote`, (error, response, body) => {
        expect(Array.isArray(JSON.parse(body).data)).toBeTruthy();
        done();
      });
    });
    it('should tell if the question we try to upvote does not exists', (done) => {
      request.patch(`${urlQuestions}/1147852/upvote`, (error, response, body) => {
        expect(error).toBeNull();
        expect(response.statusCode).toBe(404);
        expect(JSON.parse(body).status).toEqual(404);
        expect(JSON.parse(body).error).toEqual('No question matches that id');
        done();
      });
    });
  });

  describe('downvote question api endpoint', () => {
    it('should downvote a question if question id given exists', (done) => {
      request.patch(`${urlQuestions}/1/downvote`, (error, response, body) => {
        expect(error).toBeNull();
        expect(Array.isArray(JSON.parse(body).data)).toBeTruthy();
        done();
      });
    });
  });
  it('should tell if the question we try to downvote does not exists', (done) => {
    request.patch(`${urlQuestions}/8748585/downvote`, (error, response, body) => {
      expect(error).toBeNull();
      expect(JSON.parse(body).status).toEqual(404);
      expect(JSON.parse(body).error).toEqual('No question matches that id');
      done();
    });
  });
});
