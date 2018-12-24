/* eslint-disable linebreak-style */
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
  constructor(
    id,
    firstname,
    lastname,
    email,
    phoneNumber,
    userName, registered,
    isAdmin,
    othername = '',
  ) {
    this.id = id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.othername = othername;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.userName = userName;
    this.registered = registered;
    this.isAdmin = isAdmin;
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
    votes = 0,
  ) {
    this.id = id;
    this.createdOn = createdOn;
    this.createdBy = createdBy;
    this.meetup = meetup;
    this.title = title;
    this.body = body;
    this.votes = votes;
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
