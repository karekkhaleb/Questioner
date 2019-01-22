import express from 'express';
import meetupRoutes from './routes/meetupRoutes';
import questionRoutes from './routes/questionRoutes';
import authRoutes from './routes/authRoutes';
import apiFormat from './db/apiFormat.json';

const app = express();
const port = process.env.PORT || 9000;
const rootUrl = '/api/v1';

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(`${rootUrl}/meetups`, meetupRoutes);
app.use(`${rootUrl}/questions`, questionRoutes);
app.use(`${rootUrl}/auth`, authRoutes);

// noinspection JSUnresolvedFunction
app.get('/', (req, res) => res.status(200).json({
  status: 200,
  message: 'Welcome to my Restful API',
  apiFormat,
}));

app.use((req, res) => {
  res.status(404).json({
    status: 404,
    error: 'Endpoint not found',
  });
});


// eslint-disable-next-line no-console
app.listen(port, () => console.log(`app started on port ${port}`));
