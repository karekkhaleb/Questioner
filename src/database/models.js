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

export default {
  Meetup,
};
