/* eslint-disable no-restricted-syntax,no-plusplus */
import models from './models';

const {
  Meetup, Question, User, Rsvp,
} = models;

class Database {
  constructor() {
    this.meetups = [];
    this.questions = [];
    this.users = [];
    this.rsvps = [];
  }

  addMeetup(location, topic, happeningOn, tags) {
    const currentMeetupsLength = this.meetups.length;
    const id = currentMeetupsLength ? this.meetups[currentMeetupsLength - 1].id + 1 : 1;
    const createdOn = new Date().toLocaleDateString();
    const newMeetup = new Meetup(id, createdOn, location, topic, happeningOn, tags);
    this.meetups.push(newMeetup);
    return newMeetup;
  }

  getSingleMeetup(meetupId) {
    let meetup;
    for (const tempMeetup of this.meetups) {
      if (tempMeetup.id === meetupId) {
        meetup = tempMeetup;
        break;
      }
    }
    return meetup || null;
  }

  getUpcomingMeetups() {
    const upcomingMeetups = [];
    for (const meetup of this.meetups) {
      if (new Date(meetup.happeningOn) > new Date()) {
        upcomingMeetups.push(meetup);
      }
    }
    return upcomingMeetups;
  }

  addQuestion(meetupId, createdBy, title, body) {
    /**
     * checking if this meetups exists
     */
    let meetupExists = false;
    for (let i = 0; i < this.meetups.length; i++) {
      if (this.meetups[i].id === meetupId) {
        meetupExists = true;
        break;
      }
    }
    if (!meetupExists) {
      return { status: 404, error: 'Meetup not found' };
    }
    /**
     * checking if this user exists
     */
    let userExists = false;
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].id === Number.parseInt(createdBy, 10)) {
        userExists = true;
        break;
      }
    }
    if (!userExists) {
      return { status: 404, error: 'User creating question not found' };
    }

    const currentQuestionsLength = this.questions.length;
    const id = currentQuestionsLength ? this.questions[currentQuestionsLength - 1].id + 1 : 1;
    const createdOn = new Date().toLocaleDateString();
    const newQuestion = new Question(
      id,
      createdOn,
      createdBy,
      meetupId,
      title,
      body,
    );
    this.questions.push(newQuestion);
    return newQuestion;
  }

  vote(questionId, action) {
    let votedQuestion;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < this.questions.length; i++) {
      if (this.questions[i].id === questionId) {
        if (action === 'upvote') {
          this.questions[i].votes += 1;
          votedQuestion = this.questions[i];
          break;
        } else {
          this.questions[i].votes -= 1;
          votedQuestion = this.questions[i];
          break;
        }
      }
    }
    return votedQuestion || null;
  }

  signup(userCredentials) {
    const newId = this.users.length ? this.users[this.users.length - 1].id + 1 : 1;
    const newUser = new User({
      id: newId,
      firstname: userCredentials.firstname,
      lastname: userCredentials.lastname,
      email: userCredentials.email,
      othername: userCredentials.othername,
      phoneNumber: Number.parseInt(userCredentials.phoneNumber, 10),
      userName: userCredentials.userName,
      registered: new Date().toLocaleDateString(),
      isAdmin: false,
    });
    this.users.push(newUser);
    return newUser;
  }

  respondRsvp({ ...rsvpData }) {
    const rsvpId = this.rsvps.length ? this.rsvps[this.rsvps.length - 1].id + 1 : 1;
    /**
     * Check if this meetup exists
     */
    let meetup;
    for (let i = 0; i < this.meetups.length; i++) {
      if (this.meetups[i].id === rsvpData.meetupId) {
        meetup = this.meetups[i];
        break;
      }
    }
    if (!meetup) return { status: 404, error: 'No matching meetup' };
    /**
     * Check if this user exists
     */
    let userExists = false;
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].id === rsvpData.userId) {
        userExists = true;
        break;
      }
    }
    if (!userExists) return { status: 404, error: 'No matching user' };
    const newRsvp = new Rsvp(
      rsvpId,
      rsvpData.meetupId,
      rsvpData.userId,
      rsvpData.status,
    );
    return {
      meetupId: newRsvp.meetup,
      meetupTopic: meetup.topic,
      status: newRsvp.status,
    };
  }
}

export default new Database();
