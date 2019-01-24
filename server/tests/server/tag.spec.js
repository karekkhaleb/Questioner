import request from 'request';
import '../../app';
import {
  urlMeetups, urlRoot, loginAdmin, createMeetup,
} from './testUtils';

let adminObj;
let meetupObj;
let tagId;
beforeAll(async (DONE) => {
  adminObj = await loginAdmin();
  meetupObj = await createMeetup(adminObj.token);
  await request.post(`${urlRoot}/tags`, {
    json: {
      tagName: 'to-fail',
    },
    headers: { token: adminObj.token },
  });
  request.post(`${urlRoot}/tags`, {
    json: {
      tagName: 'tagToMeetup',
    },
    headers: { token: adminObj.token },
  }, (error, response, body) => {
    tagId = body.data[0].id;
    DONE();
  });
});

describe('Create tags end point', () => {
  it('should create a tag if a tag name is given', (done) => {
    request.post(`${urlRoot}/tags`, {
      json: {
        tagName: 'test',
      },
      headers: { token: adminObj.token },
    }, (error, response, body) => {
      expect(body.data[0].tagName).toEqual('test');
      done();
    });
  });
  it('should tell if the tag already exists', (done) => {
    request.post(`${urlRoot}/tags`, {
      json: {
        tagName: 'to-fail',
      },
      headers: { token: adminObj.token },
    }, (error, response, body) => {
      expect(body.error).toEqual('Tag already exists');
      done();
    });
  });

  it('should say that tagName is required if absent', (done) => {
    request.post(`${urlRoot}/tags`, {
      json: {},
      headers: { token: adminObj.token },
    }, (error, response, body) => {
      expect(body.status).toBe(400);
      expect(body.errors).toContain('tagName is required');
      done();
    });
  });
});

describe('Testing get all tags endpoint', () => {
  it('should give all available tags', (done) => {
    request.get(`${urlRoot}/tags`, {
      headers: { token: adminObj.token },
    }, (error, response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });
});
describe('Add tag to meetup', () => {
  it('should ask for tag id', (done) => {
    request.post(`${urlMeetups}/${meetupObj.id}/tags`, {
      headers: { token: adminObj.token },
    }, (error, response, body) => {
      expect(JSON.parse(body).error).toEqual('tagId is required and should be a number');
      done();
    });
  });
  it('should tell if meetup id is not a number', (done) => {
    request.post(`${urlMeetups}/not-a-number/tags`, {
      json: {
        tagId: 1,
      },
      headers: { token: adminObj.token },
    }, (error, response, body) => {
      expect(body.error).toEqual('meetupId should be a number');
      done();
    });
  });
  it('should add tag to a meetup', (done) => {
    request.post(`${urlMeetups}/1/tags`, {
      json: {
        tagId,
      },
      headers: { token: adminObj.token },
    }, (error, response, body) => {
      expect(body.data.length).toBeDefined();
      done();
    });
  });
});
