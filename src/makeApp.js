import express from 'express';
import bodyParser from 'body-parser';
import paginate from 'express-paginate';
import helmet from 'helmet';
import cors from 'cors';

import './mongoose';
import * as C from './constants';

// this function creates the express app that is used both locally and in our
// hosted environments, including production. Any changes you make here will
// be reflected everywhere, so be careful.
const makeApp = makeRoutesFunctions => {
  const app = express();
  const corsOptions = {
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Content-Length',
      'X-Requested-With',
    ],
  };

  app.use(helmet());
  app.use(bodyParser.json({ limit: '50mb', extended: true }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions));
  app.use(paginate.middleware(C.DEFAULT_QUERY_LIMIT, C.MAXIMUM_QUERY_LIMIT));

  makeRoutesFunctions.forEach(makeRoutes => {
    makeRoutes(app);
  });

  return app;
};

export default makeApp;
