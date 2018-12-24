/* eslint-disable consistent-return */
import database from '../db';

class MeetupController {
  create = (req, res) => {
    const createdQuestion = database.addQuestion(
      Number.parseInt(req.body.meetup, 10),
      Number.parseInt(req.body.createdBy, 10),
      req.body.title,
      req.body.body,
    );

    res.status(201).json({
      status: 201,
      data: [{
        createdBy: createdQuestion.createdBy,
        meetup: createdQuestion.meetup,
        title: createdQuestion.title,
        body: createdQuestion.body,
      }],
    });
  };

  getAll = (req, res) => {
    res.status(200).json({
      status: 200,
      data: database.questions,
    });
  };
}

export default new MeetupController();
