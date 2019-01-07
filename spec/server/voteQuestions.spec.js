/* eslint-disable no-unused-vars */
import request from 'request';
import server from '../../src/app';
import {
  urlAuth, urlMeetups, urlQuestions,
} from './testUtils';

let questionId;
beforeAll(async (Done) => {
  await request.post(`${urlAuth}/signup`, {
    json: {
      firstname: 'Buhungiro',
      lastname: 'Caleb',
      email: 'vote@gmail.com',
      phoneNumber: 250722387998,
      userName: 'vote',
    },
  });
  await request.post(urlMeetups, {
    json: {
      location: 'Bujumbura',
      topic: 'html',
      happeningOn: '2017-02-05',
    },
  });
  const question = await request.post(`${urlQuestions}`, {
    json: {
      meetupId: 1,
      createdBy: 1,
      title: 'test vote title',
      body: 'test vot body',
    },
  });
  questionId = JSON.parse(question.body).id;
  Done();
});

describe('upvote question api endpoint', () => {
  it('should upvote a question if question id given exists', (done) => {
    request.patch(`${urlQuestions}/${questionId || 2}/upvote`, (error, response, body) => {
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
    request.patch(`${urlQuestions}/${questionId || 2}/downvote`, (error, response, body) => {
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
