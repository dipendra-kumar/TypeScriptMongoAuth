import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import logger from 'src/helpers/logger/logger';
import { appRouter } from 'src/modules/app.route';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from 'src/swagger.json';
import 'src/config/db';
import { handleScheduleTasks } from 'src/helpers/agenda/schedulers';

const app = express();
handleScheduleTasks();

const corsOptions = {
  origin: '*', // set front-end url here
  optionSuccessStatus: 200,
  methods: 'GET, POST, PUT, PATCH, DELETE',
};

app.use(cors(corsOptions));
var swaggerOptions = {
  explorer: true,
};
app.use(morgan('dev'));

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, swaggerOptions)
);
app.use('/uploads', express.static(`${__dirname}/uploads`));
app.use('/api/v1', appRouter);

const port = process.env.PORT || 80;

app.listen(port, () => {
  logger.info('Server is running on ' + port);
});
