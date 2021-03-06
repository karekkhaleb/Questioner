/* eslint-disable no-unused-vars */
import request from 'request';
import fs from 'fs';
import path from 'path';
import server from '../../app';
import {
  urlMeetups, loginAdmin, createMeetup,
} from './testUtils';

let adminObj;
let meetupObj;
beforeAll(async (DONE) => {
  adminObj = await loginAdmin();
  meetupObj = await createMeetup(adminObj.token);
  DONE();
});

describe('Add image to meetup', () => {
  it('should add image to the meetup ', (done) => {
    const formData = {
      meetupImage: fs.createReadStream(path.join(__dirname, '../images/testImage.png')),
    };
    request.post({
      url: `${urlMeetups}/${meetupObj.id}/images`,
      headers: { token: adminObj.token },
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
      url: `${urlMeetups}/${meetupObj.id}/images`,
      headers: { token: adminObj.token },
      formData,
    }, (error, response, body) => {
      expect(JSON.parse(body).error).toEqual('unsupported image format');
      done();
    });
  });
  it('tell if meetup id given is not an integer', (done) => {
    request.post(`${urlMeetups}/not-a-number/images`, {
      headers: { token: adminObj.token },
    }, (error, response, body) => {
      expect(JSON.parse(body).error).toEqual('meetupId should be an integer');
      done();
    });
  });
});
