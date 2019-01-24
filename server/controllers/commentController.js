import Comment from '../models/comment';

class CommentController {
  create = async (req, res) => {
    const questionId = Number.parseInt(req.params.questionId, 10);
    if (Number.isNaN(questionId)) {
      req.status(400).json({
        status: 400,
        error: 'questionI should be a Number',
      });
    }
    const createdComment = await Comment.addComment(
      questionId,
      req.userData.id,
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
    return true;
  };
}

export default new CommentController();
