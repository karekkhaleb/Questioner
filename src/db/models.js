class Meetup {
  constructor({ ...meetupData }) {
    this.id = meetupData.id;
    this.createdOn = new Date();
    this.location = meetupData.location;
    this.topic = meetupData.topic;
    this.happeningOn = new Date(meetupData.happeningOn);
    this.tags = [];
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

class UpVotes {
  constructor() {
    this.userIds = [];
    this.count = 0;
  }
}

class DownVotes {
  constructor() {
    this.userIds = [];
    this.count = 0;
  }
}

class Question {
  constructor(
    id,
    createdBy,
    meetupId,
    title,
    body,
  ) {
    this.id = id;
    this.createdOn = new Date();
    this.createdBy = createdBy;
    this.meetupId = meetupId;
    this.title = title;
    this.body = body;
    this.upVotes = new UpVotes();
    this.downVotes = new DownVotes();
  }
}

class Rsvp {
  constructor(id, userId, meetupId, status) {
    this.id = id;
    this.userId = userId;
    this.meetupId = meetupId;
    this.status = status;
  }
}

export default {
  Meetup,
  User,
  Question,
  Rsvp,
};
