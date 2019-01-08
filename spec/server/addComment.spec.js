/* eslint-disable no-unused-vars */
import request from 'request';
import server from '../../src/app';
import {
  urlAuth, urlMeetups, urlQuestions, urlRoot,
} from './testUtils';

let questionId;
let meetupId;
let userId;
beforeAll((Done) => {
  request.post(`${urlAuth}/signup`, {
    json: {
      firstname: 'Buhungiro',
      lastname: 'Caleb',
      email: 'comment@gmail.com',
      password: 'testpassword',
      phoneNumber: 250722387998,
      userName: 'comment',
    },
  }, (errorU, responseU, bodyU) => {
    userId = bodyU.data[0].user.id;
    request.post(urlMeetups, {
      json: {
        location: 'Bujumbura',
        topic: 'html',
        happeningOn: '2017-02-05',
      },
    }, (errorM, responseM, bodyM) => {
      meetupId = bodyM.data[0].id;
      request.post(`${urlRoot}/questions`, {
        json: {
          meetupId,
          createdBy: userId,
          title: 'test vote title',
          body: 'test vot body',
        },
      }, (error, response, body) => {
        questionId = body.data[0].id;
        Done();
      });
    });
  });
});
//
describe('add comment endpoint', () => {
  it('should add a comment to a question', (done) => {
    request.post(`${urlRoot}/comments/`, {
      json: {
        questionId,
        userId,
        comment: 'this is a test comment',
      },
    }, (error, response, body) => {
      expect(Object.getOwnPropertyNames(body.data[0])).toContain('comment');
      done();
    });
  });
  it('should tell if the user given does not exist', (done) => {
    request.post(`${urlRoot}/comments/`, {
      json: {
        questionId,
        userId: 47852,
        comment: 'this is a test comment',
      },
    }, (error, response, body) => {
      expect(body.error).toEqual('User creating comment not found');
      done();
    });
  });
  it('should tell if the question given does not exist', (done) => {
    request.post(`${urlRoot}/comments/`, {
      json: {
        userId,
        questionId: 4785256,
        comment: 'this is a test comment',
      },
    }, (error, response, body) => {
      expect(body.error).toEqual('Question not found');
      done();
    });
  });
  it('should warn if the userId is not an integer', (done) => {
    request.post(`${urlRoot}/comments/`, {
      json: {
        questionId,
        userId: 'not a number',
        comment: 'this is a test comment',
      },
    }, (error, response, body) => {
      expect(body.error).toEqual('userId should be an integer');
      done();
    });
  });
  it('should warn if the questionId is not an integer', (done) => {
    request.post(`${urlRoot}/comments/`, {
      json: {
        questionId: 'not an integer',
        userId,
        comment: 'this is a test comment',
      },
    }, (error, response, body) => {
      expect(body.error).toEqual('questionId should be an integer');
      done();
    });
  });
  it('should ask for the comment if absent', (done) => {
    request.post(`${urlRoot}/comments/`, {
      json: {
        questionId,
        userId,
      },
    }, (error, response, body) => {
      expect(body.error).toEqual('Missing the comment');
      done();
    });
  });
  it('should userId if absent', (done) => {
    request.post(`${urlRoot}/comments/`, {
      json: {
        questionId,
        comment: 'this is a test comment',
      },
    }, (error, response, body) => {
      expect(body.error).toEqual('Missing userId');
      done();
    });
  });
  it('should ask for the questionId if absent', (done) => {
    request.post(`${urlRoot}/comments/`, {
      json: {
        userId,
        comment: 'this is a test comment',
      },
    }, (error, response, body) => {
      expect(body.error).toEqual('Missing questionId');
      done();
    });
  });
});
//
// describe('downvote question api endpoint', () => {
//   it('should downvote a question if question id given exists', (done) => {
//     request.patch(`${urlQuestions}/${questionId}/downvote`, (error, response, body) => {
//       expect(Object.getOwnPropertyNames(JSON.parse(body).data[0])).toContain('votes');
//       done();
//     });
//   });
// });
// it('should tell if the question we try to downvote does not exists', (done) => {
//   request.patch(`${urlQuestions}/8748585/downvote`, (error, response, body) => {
//     expect(JSON.parse(body).error).toEqual('No question matches that id');
//     done();
//   });
// });
