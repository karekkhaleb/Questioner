/* eslint-disable no-unused-vars */
import request from 'request';
import server from '../../src/app';
import { urlTags } from './testUtils';

describe('signup api endpoint', () => {
  beforeAll((DONE) => {
    request.post(urlTags, {
      json: {
        tagName: 'to-fail',
      },
    });
    DONE();
  });
  it('should create a tag if a tag name is given', (done) => {
    request.post(urlTags, {
      json: {
        tagName: 'test',
      },
    }, (error, response, body) => {
      expect(body.data[0].tagName).toEqual('test');
      done();
    });
  });
  it('should say that tagName is required if absent', (done) => {
    request.post(urlTags, {
      json: {
        tagName: 'to-fail',
      },
    }, (error, response, body) => {
      expect(body.error).toEqual('Tag already exists');
      done();
    });
  });
});

describe('Testing get all tags endpoint', () => {
  it('should give all available tags', (done) => {
    request.get(urlTags, (error, response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });
});
