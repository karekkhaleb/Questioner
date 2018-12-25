class Meetup {
  constructor(id,
    createdOn,
    location,
    topic,
    happeningOn,
    tags = []) {
    this.id = id;
    this.createdOn = createdOn;
    this.location = location;
    this.topic = topic;
    this.happeningOn = happeningOn;
    this.tags = tags;
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
    this.registered = userData.registered;
    this.isAdmin = userData.isAdmin;
  }
}

class Question {
  constructor(
    id,
    createdOn,
    createdBy,
    meetup,
    title,
    body,
  ) {
    this.id = id;
    this.createdOn = createdOn;
    this.createdBy = createdBy;
    this.meetup = meetup;
    this.title = title;
    this.body = body;
    this.votes = 0;
  }
}

class Rsvp {
  constructor(id, meetup, user, response) {
    this.id = id;
    this.meetup = meetup;
    this.user = user;
    this.response = response;
  }
}

export default {
  Meetup,
  User,
  Question,
  Rsvp,
};
