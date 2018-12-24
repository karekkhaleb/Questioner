import express from 'express';
import meetupRoutes from './routes/meetupRoutes';

const app = express();
const port = process.env.PORT || 9000;
const rootUrl = '/api/v1';

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(`${rootUrl}/meetups`, meetupRoutes);


app.listen(port, () => console.log(`app started on port ${port}`));
