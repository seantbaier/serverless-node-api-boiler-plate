import { version } from '../../package.json'
import config from '../config/config'

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'serverless-node-express-mongoose-boilerplate API documentation',
    version,
    license: {
      name: 'MIT',
      url:
        'https://github.com/hagopj13/node-express-mongoose-boilerplate/blob/master/LICENSE',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}${config.baseUrl}`,
    },
  ],
}

export default swaggerDef
