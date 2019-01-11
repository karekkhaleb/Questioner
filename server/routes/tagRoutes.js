import express from 'express';
import tagController from '../controllers/tagController';
import validateTag from '../middlewares/validateTag';
import { insureAdmin } from '../middlewares/validateRegistered';

const Router = express.Router();

Router.get('/', insureAdmin, tagController.getAll);
Router.post('/', insureAdmin, validateTag.checkTag, tagController.create);


export default Router;
