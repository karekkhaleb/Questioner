import request from 'request';
import '../../app';
import { baseUrl } from './testUtils';
import { executeQuery } from '../../db';

afterAll(async (DONE) => {
  const query = `
      drop table votes;
      drop table images;
      drop table meetups_tags;
      drop table tags;
      drop table comments;
      drop table questions;
      drop table rsvps;
      drop table meetups;
      drop table users;
  `;
  await executeQuery(query);
  DONE();
});

describe('Testing the base url', () => {
  it('should give a proper api endpoint', (done) => {
    request(baseUrl, (error, response) => {
      expect(response.statusCode).toEqual(200);
      done();
    });
  });
});
