import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import uploadConfig from './config/upload';
import routes from './routes';
import AppError from './errors/AppError';

import './database';

const api = express();
api.use('/files', express.static(uploadConfig.diretory));
api.use(express.json());

api.use(routes);

api.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error!',
  });
});
api.listen(3333, () => console.log('Server online port:3333'));
