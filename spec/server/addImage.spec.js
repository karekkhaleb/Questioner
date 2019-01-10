/* eslint-disable no-unused-vars */
import request from 'request';
import fs from 'fs';
import path from 'path';
import server from '../../src/app';
import { urlTags, urlMeetups, testMeetup } from './testUtils';

let meetupId;
beforeAll(async (DONE) => {
  request.post(urlMeetups, {
    json: {
      location: 'bujumbura',
      topic: 'images',
      happeningOn: testMeetup.happeningOn,
    },
  }, (error, response, body) => {
    meetupId = body.data[0].id;
    DONE();
  });
});

describe('Add image to meetup', () => {
  it('should add image to the meetup ', (done) => {
    const formData = {
      meetupImage: fs.createReadStream(path.join(__dirname, '../images/testImage.png')),
    };
    request.post({
      url: `${urlMeetups}/${meetupId}/images`,
      formData,
    }, (error, response, body) => {
      expect(Array.isArray(JSON.parse(body).data[0].images)).toBeTruthy();
      done();
    });
  });
  it('should not save files with formats other than jpeg or png ', (done) => {
    const formData = {
      meetupImage: fs.createReadStream(path.join(__dirname, '../images/testImage.txt')),
    };
    request.post({
      url: `${urlMeetups}/${meetupId}/images`,
      formData,
    }, (error, response, body) => {
      console.log(body);
      expect(JSON.parse(body).error).toEqual('unsupported image format');
      done();
    });
  });
  it('tell if meetup id given is not an integer', (done) => {
    request.post(`${urlMeetups}/not-a-number/images`, {}, (error, response, body) => {
      expect(JSON.parse(body).error).toEqual('meetupId should be an integer');
      done();
    });
  });

  // it('should add tag to a meetup', (done) => {
  //   request.post(`${urlMeetups}/1/tags`, {
  //     json: {
  //       tagId: 1,
  //     },
  //   }, (error, response, body) => {
  //     expect(body.data.length).toBeDefined();
  //     done();
  //   });
  // });
});
