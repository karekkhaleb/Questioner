/* eslint-disable no-restricted-syntax */
import models from './models';

const { Meetup } = models;

class Database {
  constructor() {
    this.meetups = [];
  }

  addMeetup(location, topic, happeningOn, tags = []) {
    const currentMeetupsLength = this.meetups.length;
    const id = currentMeetupsLength ? this.meetups[currentMeetupsLength - 1].id + 1 : 1;
    const createdOn = new Date().toLocaleDateString();
    const newMeetup = new Meetup(id, createdOn, location, topic, happeningOn, tags);
    this.meetups.push(newMeetup);
    return newMeetup;
  }
}

export default new Database();
