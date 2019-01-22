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

  vote = (questionId, userId, action) => {
    let userExists = false;
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].id === userId) {
        userExists = true;
        break;
      }
    }
    if (!userExists) return { status: 404, error: 'user not found' };
    let votedQuestion;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < this.questions.length; i++) {
      if (this.questions[i].id === questionId) {
        if (action === 'upvote') {
          const question = this.questions[i];
          if (question.upVotes.userIds.includes(userId)) {
            return { status: 409, error: 'you already upvoted this question' };
          } if (question.downVotes.userIds.includes(userId)) {
            question.upVotes.userIds.push(userId);
            question.upVotes.count += 1;
            question.downVotes.count -= 1;
            question.downVotes.userIds = question
              .downVotes.userIds.filter(user => (user !== userId));
            votedQuestion = question;
          } else {
            question.upVotes.count += 1;
            question.upVotes.userIds.push(userId);
            votedQuestion = question;
          }
          break;
        } else {
          const question = this.questions[i];
          if (question.downVotes.userIds.includes(userId)) {
            return { status: 409, error: 'you already downvoted this question' };
          } if (question.upVotes.userIds.includes(userId)) {
            question.downVotes.userIds.push(userId);
            question.downVotes.count += 1;
            question.upVotes.count -= 1;
            question.upVotes.userIds = question
              .upVotes.userIds.filter(user => (user !== userId));
            votedQuestion = question;
          } else {
            question.downVotes.count += 1;
            question.downVotes.userIds.push(userId);
            votedQuestion = question;
          }
          break;
        }
      }
    }
    return votedQuestion || {
      status: 404,
      error: 'No question matches that id',
    };
  };

  getAllMeetups = () => {
    const meetupsArr = [];
    this.meetups.forEach((meetup) => {
      const questions = [];
      this.questions.forEach((question) => {
        if (question.meetupId === meetup.id) {
          questions.push(question);
        }
      });
      const rsvps = [];
      this.rsvps.forEach((rsvp) => {
        if (rsvp.meetupId === meetup.id) {
          rsvps.push(rsvp);
        }
      });
      meetupsArr.push({
        ...meetup,
        questions,
        rsvps,
      });
    });
    return meetupsArr;
  };

  addMeetup = ({ ...meetupData }) => {
    for (const meetup of this.meetups) {
      if (meetup.topic === meetupData.topic) {
        return {
          status: 309,
          error: `Meetup "${meetup.topic}" already exists!`,
        };
      }
    }
    const currentMeetupsLength = this.meetups.length;
    const id = currentMeetupsLength + 1;
    const newMeetup = new Meetup({ ...meetupData, id });
    this.meetups.push(newMeetup);
    return newMeetup;
  };

  getSingleMeetup = (meetupId) => {
    let meetup;
    for (const tempMeetup of this.meetups) {
      if (tempMeetup.id === meetupId) {
        const questions = [];
        this.questions.forEach((question) => {
          if (question.meetupId === meetupId) {
            questions.push(question);
          }
        });
        const rsvps = [];
        this.rsvps.forEach((rsvp) => {
          if (rsvp.meetupId === meetupId) {
            rsvps.push(rsvp);
          }
        });
        meetup = { ...tempMeetup, questions, rsvps };
        break;
      }
    }
    return meetup || null;
  };

  getUpcomingMeetups = () => {
    const upcomingMeetups = [];
    for (const meetup of this.meetups) {
      if (new Date(meetup.happeningOn) > new Date()) {
        upcomingMeetups.push(meetup);
      }
    }
    return upcomingMeetups;
  };

  addQuestion = (meetupId, createdBy, title, body) => {
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
    const id = currentQuestionsLength + 1;
    const newQuestion = new Question(
      id,
      createdBy,
      meetupId,
      title,
      body,
    );
    this.questions.push(newQuestion);
    return { ...newQuestion, meetupId };
  };

  signup = (userCredentials) => {
    const newId = this.users.length + 1;
    const newUser = new User({
      id: newId,
      firstname: userCredentials.firstname,
      lastname: userCredentials.lastname,
      email: userCredentials.email,
      othername: userCredentials.othername,
      phoneNumber: Number.parseInt(userCredentials.phoneNumber, 10),
      userName: userCredentials.userName,
      isAdmin: false,
    });
    this.users.push(newUser);
    return newUser;
  };

  respondRsvp = ({ ...rsvpData }) => {
    /**
     * Check if this meetup exists
     */
    let meetup;
    let meetupIndex;
    for (let i = 0; i < this.meetups.length; i++) {
      if (this.meetups[i].id === rsvpData.meetupId) {
        meetup = this.meetups[i];
        meetupIndex = i;
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
    // check if rsvp already exists
    for (const rsvp of this.rsvps) {
      if (rsvp.userId === rsvpData.userId) {
        rsvp.status = rsvpData.status;
        return {
          meetupId: rsvpData.meetupId,
          meetupTopic: this.meetups[meetupIndex].topic,
          status: rsvp.status,
        };
      }
    }
    const rsvpId = this.rsvps.length + 1;
    const newRsvp = new Rsvp(
      rsvpId,
      rsvpData.meetupId,
      rsvpData.userId,
      rsvpData.status,
    );
    this.rsvps.push(newRsvp);
    return {
      meetupId: this.meetups[meetupIndex].id,
      meetupTopic: this.meetups[meetupIndex].topic,
      status: newRsvp.status,
    };
  };

  addTag = (meetupId, tagName) => {
    let meetupIndex;
    for (let i = 0; i < this.meetups.length; i++) {
      if (this.meetups[i].id === meetupId) {
        meetupIndex = i;
        break;
      }
    }
    if (meetupIndex === undefined) return { status: 404, error: 'meetup not found' };
    if (this.meetups[meetupIndex].tags.includes(tagName)) {
      return { status: 304, error: 'this tag already exists' };
    }
    this.meetups[meetupIndex].tags.push(tagName);
    return this.meetups[meetupIndex];
  };

  getMeetupQuestions = (meetupId) => {
    let meetupExists = false;
    for (let i = 0; i < this.meetups.length; i++) {
      if (this.meetups[i].id === meetupId) {
        meetupExists = true;
        break;
      }
    }
    if (!meetupExists) return { status: 404, error: 'Meetup not found' };
    const questions = [];
    this.questions.forEach((question) => {
      if (question.meetupId === meetupId) {
        questions.push(question);
      }
    });
    return questions;
  }
}

export default new Database();
