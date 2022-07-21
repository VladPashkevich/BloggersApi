import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { bloggersRouter } from './routers/bloggers-routers';
import { postsRouter } from './routers/posts-router';
import { runDb } from './repositories/db';
import { usersRouter } from './routers/users-router';
import { commentsRouter } from './routers/comments-router';
import { authRouter } from './routers/auth-router';
import { emailRouter } from './routers/email-router';
import { deleteRouter } from './routers/delete-router';
import cookieparser from 'cookie-parser';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(cookieparser());

app.use('/bloggers', bloggersRouter);
app.use('/posts', postsRouter);
app.use('/users', usersRouter);
app.use('/comments', commentsRouter);
app.use('/auth', authRouter);
app.use('/email', emailRouter);
app.use('/testing', deleteRouter);
app.set('trust proxy', true);

const port = process.env.PORT || 5000;

const startApp = async () => {
  console.log(process.env.mongoUri);
  await runDb();
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};
startApp();
