import express from 'express';
import tagController from '../controllers/tagController';
import validateTag from '../utils/validateTag';

const Router = express.Router();

Router.post('/', validateTag.checkTag, tagController.create);


export default Router;
