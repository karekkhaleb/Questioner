import express from 'express';
import '@babel/register';
import '@babel/polyfill';
import morgan from 'morgan';
import meetupRoutes from './routes/meetupRoutes';
import questionRoutes from './routes/questionRoutes';
import authRoutes from './routes/authRoutes';
import apiFormat from './db/apiFormat.json';


const app = express();
const port = process.env.PORT || 9000;
const rootUrl = '/api/v1';

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.use(`${rootUrl}/meetups`, meetupRoutes);
app.use(`${rootUrl}/questions`, questionRoutes);
app.use(`${rootUrl}/auth`, authRoutes);

app.get('/', (req, res) => res.status(200).json({
  status: 200,
  message: 'Welcome to my Restful API',
  apiFormat,
}));


app.listen(port, () => console.log(`app started on port ${port}`));
