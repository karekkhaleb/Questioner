import express from 'express';
import tagController from '../controllers/tagController';
import validateTag from '../middlewares/validateTag';

const Router = express.Router();

Router.get('/', tagController.getAll);
Router.post('/', validateTag.checkTag, tagController.create);


export default Router;
