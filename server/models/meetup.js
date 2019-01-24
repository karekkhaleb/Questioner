import { executeQuery } from '../db';
import dbUtils from '../db/utils';

const { databaseErrorObj } = dbUtils;

export default class Meetup {
  static getAllMeetps = async () => {
    const meetupsQuery = `select
      m.id, m.topic, m.location,
             m.happening_on,
             array_remove(array_agg(t.tag_name), null) as tags,
             array_remove(array_agg(i.image_path), null) as images
      from meetups m
      left join meetups_tags mt on mt.meetup_id = m.id
      left join tags t on mt.tag_id = t.id
      left join images i on m.id = i.meetup_id
      group by m.id;`;
    try {
      const allMeetups = await executeQuery(meetupsQuery);
      const requiredMeetups = [];
      allMeetups.forEach((row) => {
        requiredMeetups.push({
          id: row.id,
          title: row.topic,
          location: row.location,
          happeningOn: row.happening_on,
          tags: row.tags,
          images: row.images,
        });
      });
      return requiredMeetups;
    } catch (e) {
      return databaseErrorObj;
    }
  };

  static addMeetup = async ({ ...meetupData }) => {
    const query = `insert into meetups (
      location, topic, happening_on) 
      values ($1, $2, $3) returning *;
    `;
    try {
      const queryParams = [
        meetupData.location,
        meetupData.topic,
        meetupData.happeningOn,
      ];
      const result = await executeQuery(query, queryParams);
      return {
        id: result[0].id,
        createdOn: result[0].created_on,
        location: result[0].location,
        topic: result[0].topic,
        happeningOn: result[0].happening_on,
      };
    } catch (e) {
      return databaseErrorObj;
    }
  };

  static getSingleMeetup = async (meetupId) => {
    const query = `select
        m.id, m.topic, m.location,
             m.happening_on,
             array_remove(array_agg(t.tag_name), null ) as tags,
             array_remove(array_agg(i.image_path), null ) as images
        from meetups m
        left join meetups_tags mt on mt.meetup_id = m.id
        left join tags t on mt.tag_id = t.id
        left join images i on m.id = i.meetup_id
      where m.id = $1
        group by m.id;`;
    try {
      const result = await executeQuery(query, [meetupId]);
      if (result.length === 0) {
        return {
          status: 404,
          error: 'Meetup not found',
        };
      }
      return {
        id: result[0].id,
        topic: result[0].topic,
        location: result[0].location,
        happeningOn: result[0].happening_on,
        tags: result[0].tags,
        images: result[0].images,
      };
    } catch (e) {
      return databaseErrorObj;
    }
  };

  static getUpcomingMeetups = async () => {
    const query = `select
      m.id, m.topic, m.location,
       m.happening_on,
       array_remove(array_agg(t.tag_name), null) as tags,
       array_remove(array_agg(i.image_path), null) as images
      from meetups m
        left join meetups_tags mt on mt.meetup_id = m.id
        left join tags t on mt.tag_id = t.id
        left join images i on m.id = i.meetup_id
      where happening_on > now()
      group by m.id;`;
    try {
      const result = await executeQuery(query);
      const meetups = [];
      result.forEach((row) => {
        meetups.push({
          id: row.id,
          title: row.topic,
          location: row.location,
          happeningOn: row.happening_on,
          tags: row.tags,
          images: row.images,
        });
      });
      return meetups;
    } catch (e) {
      return databaseErrorObj;
    }
  };

  static addTagToMeetup = async (tagId, meetupId) => {
    const insertQuery = `insert into meetups_tags (meetup_id, tag_id)
                          values ($1, $2)`;
    const getQuery = `select m.id, m.topic, array_agg(t.tag_name) as tag_name
      from meetups_tags mt
      join meetups m on mt.meetup_id = m.id
      join tags t on mt.tag_id = t.id
      where mt.meetup_id = $1
      group by m.id;`;
    try {
      await executeQuery(insertQuery, [meetupId, tagId]);
      return await executeQuery(getQuery, [meetupId]);
    } catch (e) {
      if (e.detail === `Key (meetup_id)=(${meetupId}) is not present in table "meetups".`) {
        return {
          status: 404,
          error: 'Meetup not found',
        };
      }
      if (e.detail === `Key (meetup_id, tag_id)=(${meetupId}, ${tagId}) already exists.`) {
        return {
          status: 400,
          error: 'Record already exists',
        };
      }
      return databaseErrorObj;
    }
  };

  static deleteMeetup = async (meetupId) => {
    const query = 'delete from meetups where id = $1 returning *;';
    try {
      const deleted = await executeQuery(query, [meetupId]);
      if (!deleted.length) {
        return {
          status: 404,
          error: 'Meetup not found',
        };
      }
      return true;
    } catch (e) {
      return databaseErrorObj;
    }
  };

  static getMeetupQuestions = async (meetupId) => {
    const query = `select q.id, q.created_by, q.meetup, q.title, q.body, array_remove(array_agg(c.comment), null) as comments
      from questions q
      left join comments c on q.id = c.question_id
      where meetup = $1
      group by q.id`;
    try {
      return await executeQuery(query, [meetupId]);
    } catch (e) {
      return databaseErrorObj;
    }
  };

  static respondRsvp = async ({ ...rsvpData }) => {
    const query = `with newrsvps (meetup, response) as (
          insert into rsvps (user_id, meetup, response)
        values ($1, $2, $3) returning meetup, response
        )
        select * from newrsvps
        join meetups m on m.id = newrsvps.meetup;`;
    const params = [rsvpData.userId, rsvpData.meetupId, rsvpData.status];
    try {
      const result = await executeQuery(query, params);
      return {
        meetupId: result[0].meetup,
        meetupTopic: result[0].topic,
        status: result[0].response,
      };
    } catch (e) {
      if (e.detail === `Key (user_id, meetup)=(${rsvpData.userId}, ${rsvpData.meetupId}) already exists.`) {
        return {
          status: 400,
          error: 'User already responded to this meetup',
        };
      }
      if (e.detail === `Key (user_id)=(${rsvpData.userId}) is not present in table "users".`) {
        return {
          status: 400,
          error: 'User not available',
        };
      }
      if (e.detail === `Key (meetup)=(${rsvpData.meetupId}) is not present in table "meetups".`) {
        return {
          status: 400,
          error: 'Meetup not available',
        };
      }
      return databaseErrorObj;
    }
  };

  static addImage = async (meetupId, imagePath) => {
    const insertQuery = `insert into images (meetup_id, image_path)
      values ($1, $2) returning meetup_id, image_path;`;
    const getQuery = `select 
      m.id as meetup_id, m.topic, array_remove(array_agg(i.image_path),null) as images
      from meetups m
      left join images i on m.id = i.meetup_id
      where m.id = $1
      group by m.id;`;
    try {
      await executeQuery(insertQuery, [meetupId, imagePath]);
      const result = await executeQuery(getQuery, [meetupId]);
      return {
        meetup: result[0].meetup_id,
        topic: result[0].topic,
        images: result[0].images,
      };
    } catch (e) {
      return databaseErrorObj;
    }
  }
}
