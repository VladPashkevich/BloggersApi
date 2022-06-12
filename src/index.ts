import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();

app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 5000;

let bloggers = [
  { id: 1, name: 'Vasya', youtubeUrl: 'it-incubator.eu' },
  { id: 2, name: 'Vova', youtubeUrl: 'it-incubator.eu' },
  { id: 3, name: 'Alex', youtubeUrl: 'it-incubator.eu' },
  { id: 4, name: 'Sasha', youtubeUrl: 'it-incubator.eu' },
  { id: 5, name: 'Vitya', youtubeUrl: 'it-incubator.eu' },
];
let posts = [
  {
    id: 1,
    title: 'privet',
    shortDescription: 'privetstvie',
    content: 'abrakadabra',
    bloggerId: 1,
    bloggerName: 'Vasya',
  },
  {
    id: 2,
    title: 'poka',
    shortDescription: 'proshanie',
    content: 'abrabaraka',
    bloggerId: 2,
    bloggerName: 'Vova',
  },
];

app.get('/bloggers', (req: Request, res: Response) => {
  res.send(bloggers);
});

app.get('/bloggers/:bloggerId', (req: Request, res: Response) => {
  const id = +req.params.bloggerId;
  const blogger = bloggers.find((b) => b.id === id);

  if (blogger) {
    res.send(blogger);
  } else {
    res.send(404);
  }
});

app.post('/bloggers', (req: Request, res: Response) => {
  const errorsMessage: any[] = [];
  let name = req.body.name;
  let url = req.body.youtubeUrl;
  if (!name || typeof name !== 'string' || !name.trim() || name.length > 15) {
    errorsMessage.push({
      message: 'Incorrect name',
      field: 'name',
    });
    return;
  }
  if (!url || typeof url !== 'string' || !url.trim() || url.length > 100) {
    errorsMessage.push({
      message: 'Incorrect youtubeUrl',
      field: 'youtubeUrl',
    });
    return;
  }
  if (errorsMessage.length > 0) {
    res.status(400).send(errorsMessage);
  }

  const newBlogger = {
    id: +new Date(),
    name: name,
    youtubeUrl: url,
  };
  bloggers.push(newBlogger);
  res.status(201).send(newBlogger);
});

app.put('/bloggers/:bloggerId', (req: Request, res: Response) => {
  let name = req.body.name;
  let url = req.body.youtubeUrl;

  if (
    !name ||
    typeof name !== 'string' ||
    !name.trim() ||
    name.length > 15 ||
    !url ||
    typeof url !== 'string' ||
    !url.trim() ||
    url.length > 100
  ) {
    res.status(400).send({
      errorsMessages: [
        {
          message: 'Incorrect youtubeUrl',
          field: 'youtubeUrl',
        },
        {
          message: 'Incorrect name',
          field: 'name',
        },
      ],
    });
    return;
  }
  const id = +req.params.bloggerId;
  const blogger = bloggers.find((v) => v.id === id);

  if (blogger) {
    blogger.name = name;
    res.status(204).send(blogger);
  } else {
    res.send(404);
  }
});

app.delete('/bloggers/:bloggerId', (req: Request, res: Response) => {
  const id = +req.params.bloggerId;
  const index = bloggers.findIndex((v) => v.id === id);

  if (index === -1) {
    res.sendStatus(404);
  } else {
    bloggers.splice(index, 1);
    res.sendStatus(204);
  }
});

app.get('/posts', (req: Request, res: Response) => {
  res.status(200).send(posts);
});

app.post('/posts', (req: Request, res: Response) => {
  let title = req.body.title;
  let descript = req.body.shortDescription;
  let content = req.body.content;
  let bloggerId = +req.body.bloggerId;
  const blogger = bloggers.find((blogger) => bloggerId === blogger.id);
  if (
    !title ||
    typeof title !== 'string' ||
    !title.trim() ||
    title.length > 30 ||
    !descript ||
    typeof descript !== 'string' ||
    !descript.trim() ||
    descript.length > 100 ||
    !content ||
    typeof content !== 'string' ||
    !content.trim() ||
    content.length > 1000 ||
    !bloggerId ||
    typeof bloggerId !== 'number'
  ) {
    res.status(400).send({
      errorsMessages: [
        {
          message: 'Incorrect shortDescription',
          field: 'shortDescription',
        },
        {
          message: 'Incorrect title',
          field: 'title',
        },
      ],
    });
    return;
  }

  if (!blogger) {
    res.send(404);
    return;
  }
  const post = {
    id: +new Date(),
    title: title,
    shortDescription: descript,
    content: content,
    bloggerId: bloggerId,
    bloggerName: blogger.name,
  };
  posts.push(post);
  res.status(201).send(post);
});

app.put('/posts/:postId', (req: Request, res: Response) => {
  let title = req.body.title;
  let descript = req.body.shortDescription;
  let content = req.body.content;
  let bloggerId = +req.body.bloggerId;
  const blogger = bloggers.find((blogger) => bloggerId === blogger.id);

  if (
    !title ||
    typeof title !== 'string' ||
    !title.trim() ||
    title.length > 30 ||
    !descript ||
    typeof descript !== 'string' ||
    !descript.trim() ||
    descript.length > 100 ||
    !content ||
    typeof content !== 'string' ||
    !content.trim() ||
    content.length > 1000 ||
    !bloggerId ||
    typeof bloggerId !== 'number'
  ) {
    res.status(400).send({
      errorsMessages: [
        {
          message: 'Incorrect shortDescription',
          field: 'shortDescription',
        },
        {
          message: 'Incorrect title',
          field: 'title',
        },
      ],
    });
    return;
  }

  if (!blogger) {
    res.send(404);
    return;
  }

  const id = +req.params.postId;
  const post = posts.find((p) => p.id === id);
  if (post) {
    post.title = title;
    post.shortDescription = descript;
    post.content = content;
    post.bloggerId = bloggerId;
    res.status(204).send(post);
  } else {
    res.send(404);
  }
});

app.get('/posts/:postId', (req: Request, res: Response) => {
  const id = +req.params.postId;
  const post = posts.find((b) => b.id === id);
  if (post) {
    res.status(200).send(post);
  } else {
    res.send(404);
  }
});

app.delete('/posts/:postId', (req: Request, res: Response) => {
  const id = +req.params.postId;
  const index = posts.findIndex((v) => v.id === id);

  if (index === -1) {
    res.sendStatus(404);
  } else {
    posts.splice(index, 1);
    res.send(204);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
