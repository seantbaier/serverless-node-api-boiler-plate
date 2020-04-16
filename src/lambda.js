/* eslint-disable no-param-reassign */

import serverless from 'serverless-http';
import makeApp from './makeApp';
import makeRoutes from './makeRoutes';

// make the server
const app = makeApp([makeRoutes]);

const handler = serverless(app, {
  request: (request, event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    if (event.source === 'serverless-plugin-warmup') {
      request.method = 'GET';
      request.url = '/warmup';
    }
  },
});

// eslint-disable-next-line import/prefer-default-export
export { handler };
