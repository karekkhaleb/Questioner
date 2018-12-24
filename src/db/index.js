/* eslint-disable no-restricted-syntax */
import models from './models';

const { Meetup, Question } = models;

class Database {
  constructor() {
    this.meetups = [];
    this.questions = [];
  }

  addMeetup(location, topic, happeningOn, tags = []) {
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

  addQuestion(meetup, createdBy, title, body) {
    const currentQuestionsLength = this.questions.length;
    const id = currentQuestionsLength ? this.questions[currentQuestionsLength - 1].id + 1 : 1;
    const createdOn = new Date().toLocaleDateString();
    const newQuestion = new Question(
      id,
      createdOn,
      createdBy,
      meetup,
      title,
      body,
    );
    this.questions.push(newQuestion);
    return newQuestion;
  }
}

export default new Database();
