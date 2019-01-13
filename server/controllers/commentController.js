/* eslint-disable consistent-return */
import Comment from '../models/comment';

class CommentController {
  create = async (req, res) => {
    const createdComment = await Comment.addComment(
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

export default new CommentController();
