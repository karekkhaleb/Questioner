// /* eslint-disable no-unused-vars */
// import request from 'request';
// import server from '../../server/app';
// import {
//   urlAuth, urlMeetups, admin, urlRoot,
// } from './testUtils';
//
// let questionId;
// let meetupId;
// let userId;
// let Token;
// beforeAll((Done) => {
//   request.post(`${urlAuth}/login`, {
//     json: admin,
//   }, (errorU, responseU, bodyU) => {
//     userId = bodyU.data[0].user.id;
//     Token = bodyU.data[0].token;
//     request.post(urlMeetups, {
//       json: {
//         location: 'Bujumbura',
//         topic: 'html',
//         happeningOn: '2017-02-05',
//       },
//       headers: {
//         token: Token,
//       },
//     }, (errorM, responseM, bodyM) => {
//       meetupId = bodyM.data[0].id;
//       request.post(`${urlRoot}/questions`, {
//         json: {
//           meetupId,
//           createdBy: userId,
//           title: 'test vote title',
//           body: 'test vot body',
//         },
//         headers: {
//           token: Token,
//         },
//       }, (error, response, body) => {
//         questionId = body.data[0].id;
//         Done();
//       });
//     });
//   });
// });
// //
// describe('add comment endpoint', () => {
//   it('should add a comment to a question', (done) => {
//     request.post(`${urlRoot}/comments/`, {
//       json: {
//         questionId,
//         userId,
//         comment: 'this is a test comment',
//       },
//       headers: {
//         token: Token,
//       },
//     }, (error, response, body) => {
//       expect(Object.getOwnPropertyNames(body.data[0])).toContain('comment');
//       done();
//     });
//   });
//   it('should tell if the user given does not exist', (done) => {
//     request.post(`${urlRoot}/comments/`, {
//       json: {
//         questionId,
//         userId: 47852,
//         comment: 'this is a test comment',
//       },
//       headers: {
//         token: Token,
//       },
//     }, (error, response, body) => {
//       expect(body.error).toEqual('User creating comment not found');
//       done();
//     });
//   });
//   it('should tell if the question given does not exist', (done) => {
//     request.post(`${urlRoot}/comments/`, {
//       json: {
//         userId,
//         questionId: 4785256,
//         comment: 'this is a test comment',
//       },
//       headers: {
//         token: Token,
//       },
//     }, (error, response, body) => {
//       expect(body.error).toEqual('Question not found');
//       done();
//     });
//   });
//   it('should warn if the userId is not an integer', (done) => {
//     request.post(`${urlRoot}/comments/`, {
//       json: {
//         questionId,
//         userId: 'not a number',
//         comment: 'this is a test comment',
//       },
//       headers: {
//         token: Token,
//       },
//     }, (error, response, body) => {
//       expect(body.error).toEqual('userId should be an integer');
//       done();
//     });
//   });
//   it('should warn if the questionId is not an integer', (done) => {
//     request.post(`${urlRoot}/comments/`, {
//       json: {
//         questionId: 'not an integer',
//         userId,
//         comment: 'this is a test comment',
//       },
//       headers: {
//         token: Token,
//       },
//     }, (error, response, body) => {
//       expect(body.error).toEqual('questionId should be an integer');
//       done();
//     });
//   });
//   it('should ask for the comment if absent', (done) => {
//     request.post(`${urlRoot}/comments/`, {
//       json: {
//         questionId,
//         userId,
//       },
//       headers: {
//         token: Token,
//       },
//     }, (error, response, body) => {
//       expect(body.error).toEqual('Missing the comment');
//       done();
//     });
//   });
//   it('should userId if absent', (done) => {
//     request.post(`${urlRoot}/comments/`, {
//       json: {
//         questionId,
//         comment: 'this is a test comment',
//       },
//       headers: {
//         token: Token,
//       },
//     }, (error, response, body) => {
//       expect(body.error).toEqual('Missing userId');
//       done();
//     });
//   });
//   it('should ask for the questionId if absent', (done) => {
//     request.post(`${urlRoot}/comments/`, {
//       json: {
//         userId,
//         comment: 'this is a test comment',
//       },
//       headers: {
//         token: Token,
//       },
//     }, (error, response, body) => {
//       expect(body.error).toEqual('Missing questionId');
//       done();
//     });
//   });
// });
