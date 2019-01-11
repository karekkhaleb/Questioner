// /* eslint-disable no-unused-vars */
// import request from 'request';
// import server from '../../server/app';
// import {
//   urlAuth, urlMeetups, urlQuestions, urlRoot,
// } from './testUtils';
//
// let questionId;
// let meetupId;
// let userId;
// beforeAll((Done) => {
//   request.post(`${urlAuth}/signup`, {
//     json: {
//       firstname: 'Buhungiro',
//       lastname: 'Caleb',
//       email: 'questionComments@gmail.com',
//       password: 'testpassword',
//       phoneNumber: 250722387998,
//       userName: 'questionComments',
//     },
//   }, (errorU, responseU, bodyU) => {
//     userId = bodyU.data[0].user.id;
//     request.post(urlMeetups, {
//       json: {
//         location: 'Bujumbura',
//         topic: 'html',
//         happeningOn: '2017-02-05',
//       },
//     }, (errorM, responseM, bodyM) => {
//       meetupId = bodyM.data[0].id;
//       request.post(`${urlRoot}/questions`, {
//         json: {
//           meetupId,
//           createdBy: userId,
//           title: 'test comment title',
//           body: 'test comment body',
//         },
//       }, (error, response, body) => {
//         questionId = body.data[0].id;
//         Done();
//       });
//     });
//   });
// });
//
// describe('get comments for a given question', () => {
//   it('should give all the comments for the given question', (done) => {
//     request.get(`${urlRoot}/questions/${questionId}/comments`, (error, response, body) => {
//       expect(Array.isArray(JSON.parse(body).data[0].comments)).toBeTruthy();
//       done();
//     });
//   });
//   it('should tell if the questionId given is not a number', (done) => {
//     request.get(`${urlRoot}/questions/not-a-number/comments`, (error, response, body) => {
//       expect(JSON.parse(body).error).toEqual('questionId is required and should be a number');
//       done();
//     });
//   });
//   it('should tell if the questionId given is not found', (done) => {
//     request.get(`${urlRoot}/questions/74125896/comments`, (error, response, body) => {
//       expect(JSON.parse(body).error).toEqual('Question not found');
//       done();
//     });
//   });
// });
