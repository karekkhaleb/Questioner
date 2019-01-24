import request from 'request';
import '../../app';
import {
  createMeetup, createQuestion,
  loginAdmin,
  urlQuestions,
} from './testUtils';

let questionObj;
let adminObj;
let meetupObj;
beforeAll(async (Done) => {
  adminObj = await loginAdmin();
  meetupObj = await createMeetup(adminObj.token);
  questionObj = await createQuestion(meetupObj.id, adminObj.user.id, adminObj.token);
  Done();
});

describe('upvote question api endpoint', () => {
  // it('should upvote a question if question id given exists', (done) => {
  //   request.patch(`${urlQuestions}/${questionObj.id}/upvote`, {
  //     headers: { token: adminObj.token },
  //   }, (error, response, body) => {
  //     // console.log(body);
  //     // expect(body.data).toBeDefined();
  //     // expect(body.data.meetup).toEqual(meetupObj.id);
  //     // expect(body.data.title).toEqual(questionObj.title);
  //     // expect(body.data.body).toEqual(questionObj.body);
  //     // expect(Object.getOwnPropertyNames(JSON.parse(body).data[0])).toContain('votes');
  //     done();
  //   });
  // });
  it('should tell if the question we try to upvote does not exists', (done) => {
    request.patch(`${urlQuestions}/1147852/upvote`, {
      headers: { token: adminObj.token },
    }, (error, response, body) => {
      expect(response.statusCode).toBe(404);
      expect(JSON.parse(body).error).toEqual('question not found');
      done();
    });
  });
});


describe('downvote question api endpoint', () => {
  // it('should downvote a question if question id given exists', (done) => {
  //   request.patch(`${urlQuestions}/${questionObj.id}/downvote`, {
  //     headers: { token: adminObj.token },
  //   }, (error, response, body) => {
  //     console.log(body);
  //     expect(Object.getOwnPropertyNames(JSON.parse(body).data[0])).toContain('votes');
  //     done();
  //   });
  // });
});
it('should tell if the question we try to downvote does not exists', (done) => {
  request.patch(`${urlQuestions}/8748585/downvote`, {
    headers: { token: adminObj.token },
  }, (error, response, body) => {
    expect(JSON.parse(body).error).toEqual('question not found');
    done();
  });
});
