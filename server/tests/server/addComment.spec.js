import request from 'request';
import '../../app';
import {
  urlRoot, loginAdmin, createMeetup, createQuestion,
} from './testUtils';

let adminObj;
let meetupObj;
let questionObj;
beforeAll(async (Done) => {
  adminObj = await loginAdmin();
  meetupObj = await createMeetup(adminObj.token);
  questionObj = await createQuestion(meetupObj.id, adminObj.user.id, adminObj.token);
  Done();
});

describe('add comment endpoint', () => {
  it('should add a comment to a question', (done) => {
    request.post(`${urlRoot}/comments/`, {
      json: {
        questionId: questionObj.id,
        userId: adminObj.user.id,
        comment: 'this is a test comment',
      },
      headers: {
        token: adminObj.token,
      },
    }, (error, response, body) => {
      expect(Object.getOwnPropertyNames(body.data[0])).toContain('comment');
      done();
    });
  });
  it('should tell if the user given does not exist', (done) => {
    request.post(`${urlRoot}/comments/`, {
      json: {
        questionId: questionObj.id,
        userId: 47852,
        comment: 'this is a test comment',
      },
      headers: {
        token: adminObj.token,
      },
    }, (error, response, body) => {
      expect(body.error).toEqual('User creating comment not found');
      done();
    });
  });
  it('should tell if the question given does not exist', (done) => {
    request.post(`${urlRoot}/comments/`, {
      json: {
        userId: adminObj.user.id,
        questionId: 4785256,
        comment: 'this is a test comment',
      },
      headers: {
        token: adminObj.token,
      },
    }, (error, response, body) => {
      expect(body.error).toEqual('Question not found');
      done();
    });
  });
  it('should warn if the userId is not an integer', (done) => {
    request.post(`${urlRoot}/comments/`, {
      json: {
        questionId: questionObj.id,
        userId: 'not a number',
        comment: 'this is a test comment',
      },
      headers: {
        token: adminObj.token,
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
        userId: adminObj.user.id,
        comment: 'this is a test comment',
      },
      headers: {
        token: adminObj.token,
      },
    }, (error, response, body) => {
      expect(body.error).toEqual('questionId should be an integer');
      done();
    });
  });
  it('should ask for the comment if absent', (done) => {
    request.post(`${urlRoot}/comments/`, {
      json: {
        questionId: questionObj.id,
        userId: adminObj.user.id,
      },
      headers: {
        token: adminObj.token,
      },
    }, (error, response, body) => {
      expect(body.error).toEqual('Missing the comment');
      done();
    });
  });
  it('should userId if absent', (done) => {
    request.post(`${urlRoot}/comments/`, {
      json: {
        questionId: questionObj.id,
        comment: 'this is a test comment',
      },
      headers: {
        token: adminObj.token,
      },
    }, (error, response, body) => {
      expect(body.error).toEqual('Missing userId');
      done();
    });
  });
  it('should ask for the questionId if absent', (done) => {
    request.post(`${urlRoot}/comments/`, {
      json: {
        userId: adminObj.user.id,
        comment: 'this is a test comment',
      },
      headers: {
        token: adminObj.token,
      },
    }, (error, response, body) => {
      expect(body.error).toEqual('Missing questionId');
      done();
    });
  });
});
