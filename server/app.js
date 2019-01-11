import express from 'express';
import '@babel/register';
import '@babel/polyfill';
import morgan from 'morgan';
import meetupRoutes from './routes/meetupRoutes';
import questionRoutes from './routes/questionRoutes';
import commentRoutes from './routes/commentRoutes';
import authRoutes from './routes/authRoutes';
import tagRoutes from './routes/tagRoutes';
import apiFormat from './db/apiFormat.json';
import { prepareDatabase } from './db';
import { insureToken } from './middlewares/validateRegistered';


const app = express();
const port = process.env.PORT || 9000;
// noinspection JSIgnoredPromiseFromCall
const rootUrl = '/api/v1';

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.use(`${rootUrl}/meetups`, insureToken, meetupRoutes);
app.use(`${rootUrl}/questions`, insureToken, questionRoutes);
app.use(`${rootUrl}/auth`, authRoutes);
app.use(`${rootUrl}/tags`, insureToken, tagRoutes);
app.use(`${rootUrl}/comments`, insureToken, commentRoutes);

app.get('/', (req, res) => res.status(200).json({
  status: 200,
  message: 'Welcome to my Restful API',
  apiFormat,
}));

app.on('ready', () => {
  app.listen(port, () => console.log(`app started on port ${port}`));
});

prepareDatabase().then(() => {
  app.emit('ready');
});
