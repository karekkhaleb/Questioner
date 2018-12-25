const urlRoot = 'http://localhost:9000/api/v1';
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
  happeningOn: '2019-01-27',
  tags: ['junior-developers', 'kigali-developers'],
};
const testQuestion = {
  meetup: 1,
  createdBy: 1,
  title: 'sample question',
  body: 'why do we need this in the first place?',
};

export {
  urlRoot,
  urlAuth,
  urlMeetups,
  urlQuestions,
  testMeetup,
  testQuestion,
  testUser,
};