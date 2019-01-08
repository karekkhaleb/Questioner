/* eslint-disable consistent-return */
import database from '../db';

class QuestionController {
  create = async (req, res) => {
    const createdComment = await database.addComment(
      Number.parseInt(req.body.questionId, 10),
      Number.parseInt(req.body.userId, 10),
      req.body.comment,
    );

    if (createdComment && createdComment.error) {
      return res.status(createdComment.status).json({
        status: createdComment.status,
        error: createdComment.error,
      });
    }
    res.status(201).json({
      status: 201,
      data: [createdComment],
    });
  };
}

export default new QuestionController();
