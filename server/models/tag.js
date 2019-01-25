import dbUtils from '../db/utils';
import { executeQuery } from '../db';

const { databaseErrorObj } = dbUtils;


export default class Tag {
  static createTag = async (tagName) => {
    const query = 'insert into tags(tag_name) values ($1) returning *';
    try {
      const result = await executeQuery(query, [tagName]);
      return {
        id: result[0].id,
        tagName: result[0].tag_name,
      };
    } catch (e) {
      if (e.detail && e.detail.includes('already exists')) {
        return {
          status: 400,
          error: 'Tag already exists',
        };
      }
      return databaseErrorObj;
    }
  };

  static getAllTags = async () => {
    const query = 'select * from tags';
    try {
      return await executeQuery(query);
    } catch (e) {
      return databaseErrorObj;
    }
  };
}
