import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { bloggersRouter } from './routers/bloggers-routers';
import { postsRouter } from './routers/posts-router';

const app = express();
const basicAuth = require('express-basic-auth');
app.use(
  basicAuth({
    users: { admin: 'qwerty' },
  }),
);
app.use(cors());
app.use(bodyParser.json());

app.use('/bloggers', bloggersRouter);
app.use('/posts', postsRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
