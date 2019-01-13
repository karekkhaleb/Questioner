import request from 'request';
import { prepareDatabase } from '../../db';

const baseUrl = 'http://localhost:9000';
const urlRoot = `${baseUrl}/api/v1`;
const urlMeetups = `${urlRoot}/meetups`;
const urlAuth = `${urlRoot}/auth`;
const urlQuestions = `${urlRoot}/questions`;
const testMeetup = {
  location: 'kigali',
  topic: 'Server side rendering',
  happeningOn: '2020-01-27',
};
const admin = {
  email: process.env.ADMINEMAIL,
  password: process.env.ADMINPASSWORD,
};

const loginAdmin = async () => new Promise(async (resolve) => {
  await prepareDatabase();
  request.post(`${urlAuth}/login`, {
    json: admin,
  }, (errorU, responseU, bodyU) => {
    resolve(bodyU.data[0]);
  });
});

const createMeetup = async token => new Promise((resolve) => {
  request.post(urlMeetups, {
    json: {
      location: testMeetup.location,
      topic: testMeetup.topic,
      happeningOn: testMeetup.happeningOn,
    },
    headers: {
      token,
    },
  }, (error, response, body) => {
    resolve(body.data[0]);
  });
});

const createQuestion = (meetupId, userId, token) => new Promise((resolve) => {
  request.post(`${urlRoot}/questions`, {
    json: {
      meetupId,
      createdBy: userId,
      title: 'test vote title',
      body: 'test vot body',
    },
    headers: {
      token,
    },
  }, (error, response, body) => {
    resolve(body.data[0]);
  });
});

export {
  urlRoot,
  urlAuth,
  urlMeetups,
  urlQuestions,
  testMeetup,
  baseUrl,
  admin,
  loginAdmin,
  createMeetup,
  createQuestion,
};
