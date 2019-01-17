class Meetup {
  constructor({ ...meetupData }) {
    this.id = meetupData.id;
    this.createdOn = new Date();
    this.location = meetupData.location;
    this.topic = meetupData.topic;
    this.happeningOn = new Date(meetupData.happeningOn);
    this.tags = meetupData.tags;
  }
}
class User {
  constructor({ ...userData }) {
    this.id = userData.id;
    this.firstname = userData.firstname;
    this.lastname = userData.lastname;
    this.othername = userData.othername || '';
    this.email = userData.email;
    this.phoneNumber = userData.phoneNumber;
    this.userName = userData.userName;
    this.registered = new Date();
    this.isAdmin = userData.isAdmin;
  }
}

class Question {
  constructor(
    id,
    createdBy,
    meetup,
    title,
    body,
  ) {
    this.id = id;
    this.createdOn = new Date();
    this.createdBy = createdBy;
    this.meetup = meetup;
    this.title = title;
    this.body = body;
    this.votes = 0;
  }
}

class Rsvp {
  constructor(id, meetupId, userId, status) {
    this.id = id;
    this.meetup = meetupId;
    this.userId = userId;
    this.status = status;
  }
}

export default {
  Meetup,
  User,
  Question,
  Rsvp,
};
