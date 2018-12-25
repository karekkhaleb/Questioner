import express from 'express';
import meetupRoutes from './routes/meetupRoutes';
import questionRoutes from './routes/questionRoutes';
import authRoutes from './routes/authRoutes';

const app = express();
const port = process.env.PORT || 9000;
const rootUrl = '/api/v1';

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(`${rootUrl}/meetups`, meetupRoutes);
app.use(`${rootUrl}/questions`, questionRoutes);
app.use(`${rootUrl}/auth`, authRoutes);


app.listen(port, () => console.log(`app started on port ${port}`));
