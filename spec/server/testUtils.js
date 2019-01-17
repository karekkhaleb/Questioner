const baseUrl = 'http://localhost:9000';
const urlRoot = `${baseUrl}/api/v1`;
const urlMeetups = `${urlRoot}/meetups`;
const urlAuth = `${urlRoot}/auth`;
const urlQuestions = `${urlRoot}/questions`;

const testUser = {
  firstname: 'buhungiro',
  lastname: 'caleb',
  email: 'karekkhaleb@gmail.com',
  phoneNumber: 250783339057,
  userName: 'karekkhaleb',
  othername: 'zoar',
};
const testMeetup = {
  location: 'kigali',
  topic: 'Server side rendering',
  happeningOn: '2020-01-27',
  tags: ['junior-developers', 'kigali-developers'],
};

export {
  urlRoot,
  urlAuth,
  urlMeetups,
  urlQuestions,
  testMeetup,
  testUser,
  baseUrl,
};
