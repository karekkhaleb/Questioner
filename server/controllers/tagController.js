/* eslint-disable consistent-return */
import database from '../db';

class TagController {
  create = async (req, res) => {
    if (req.errors.length) {
      return res.status(400).json({
        status: 400,
        errors: req.errors,
      });
    }
    const createdTag = await database.createTag(req.body.tagName.trim());
    if (createdTag && createdTag.error) {
      return res.status(createdTag.status).json(createdTag);
    }
    res.status(201).json({
      status: 201,
      data: [createdTag],
    });
  };

  getAll = async (req, res) => {
    const tags = await database.getAllTags();
    if (tags && tags.error) {
      return res.status(tags.status).json({
        status: tags.status,
        error: tags.error,
      });
    }
    res.status(200).json({
      status: 200,
      data: tags,
    });
  };
}
export default new TagController();
