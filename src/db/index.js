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
}

export default new Database();
