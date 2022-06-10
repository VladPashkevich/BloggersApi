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
let posts = [{}];

app.get('/bloggers', (req: Request, res: Response) => {
  res.send(bloggers);
});

app.post('/bloggers', (req: Request, res: Response) => {
  let name = req.body.name;
  let url = req.body.youtubeUrl;
  if (
    (!name || typeof name !== 'string' || !name.trim() || name.length > 15) &&
    (!url || typeof url !== 'string' || !url.trim() || url.length > 100)
  ) {
    res.status(400).send({
      errormessages: [
        {
          message: 'Incorect name',
          field: 'name',
        },
        {
          message: 'Incorect url',
          field: 'url',
        },
      ],
    });
    return;
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
    (!name || typeof name !== 'string' || !name.trim() || name.length > 15) &&
    (!url || typeof url !== 'string' || !url.trim() || url.length > 100)
  ) {
    res.status(400).send({
      errormessages: [
        {
          message: 'Incorect name',
          field: 'name',
        },
        {
          message: 'Incorect url',
          field: 'url',
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
    res.sendStatus(404);
  }
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

app.delete('/bloggers/:bloggerId', (req: Request, res: Response) => {
  const id = +req.params.videoId;
  const newBloggers = bloggers.filter((v) => v.id !== id);

  if (newBloggers.length < bloggers.length) {
    bloggers = newBloggers;
    res.send(204);
  } else {
    res.send(404);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
