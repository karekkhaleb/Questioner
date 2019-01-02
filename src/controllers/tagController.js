/* eslint-disable consistent-return */
import database from '../db';

class TagController {
  create = async (req, res) => {
    const createdTag = await database.createTag(req.body.tagName);
    if (createdTag && createdTag.error) {
      return res.status(createdTag.status).json(createdTag);
    }
    res.status(201).json({
      status: 201,
      data: [createdTag],
    });
  };
}
export default new TagController();
