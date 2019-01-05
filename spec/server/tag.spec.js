/* eslint-disable no-unused-vars */
import request from 'request';
import server from '../../src/app';
import { urlTags, urlMeetups, testMeetup } from './testUtils';

beforeAll((DONE) => {
  request.post(urlTags, {
    json: {
      tagName: 'tagToMeetup',
    },
  });
  request.post(urlTags, {
    json: {
      tagName: 'to-fail',
    },
  });
  request.post(urlMeetups, {
    json: {
      location: testMeetup.location,
      topic: testMeetup.topic,
      happeningOn: testMeetup.happeningOn,
      tags: testMeetup.tags,
    },
  });
  DONE();
});

describe('Create tags end point', () => {
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
  it('should tell if the tag already exists', (done) => {
    request.post(urlTags, {
      json: {
        tagName: 'to-fail',
      },
    }, (error, response, body) => {
      expect(body.error).toEqual('Tag already exists');
      done();
    });
  });

  it('should say that tagName is required if absent', (done) => {
    request.post(urlTags, {
      json: {},
    }, (error, response, body) => {
      expect(body.error).toEqual('tagName is required');
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
describe('Add tag to meetup', () => {
  it('should ask for tag id', (done) => {
    request.post(`${urlMeetups}/1/tags`, {}, (error, response, body) => {
      expect(JSON.parse(body).error).toEqual('tagId is required and should be a number');
      done();
    });
  });
  it('should tell if meetup id is not a number', (done) => {
    request.post(`${urlMeetups}/not-a-number/tags`, {
      json: {
        tagId: 1,
      },
    }, (error, response, body) => {
      expect(body.error).toEqual('meetupId should be a number');
      done();
    });
  });
  it('should add tag to a meetup', (done) => {
    request.post(`${urlMeetups}/1/tags`, {
      json: {
        tagId: 1,
      },
    }, (error, response, body) => {
      expect(body.data.length).toBeDefined();
      done();
    });
  });
});
