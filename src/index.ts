import 'dotenv/config';
import { Buffer } from 'buffer';
import express, { json, urlencoded, Request, Response } from 'express';
import cors from 'cors';
import routes from './routes/index.js';

import serverless from 'serverless-http';

const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(urlencoded({ extended: false }));
app.use(
  json({
    verify: (req: Request, res: Response, buf: Buffer) => {
      req.rawBody = buf;
    },
  }),
);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// Routes
app.use('/api', routes);

if (process.env.NODE_ENV === 'development') {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

export const handler = serverless(app);
