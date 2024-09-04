import { connectToDB } from '@database/index';
import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.json(new Date());
});

app.listen(process.env.PORT, async () => {
    console.log('Server listening on port %d', process.env.PORT);

    await connectToDB();
});
