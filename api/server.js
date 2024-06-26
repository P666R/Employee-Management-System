import chalk from 'chalk';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';

import connectionToDB from './config/connectDB.js';
import { morganMiddleware, systemLogs } from './utils/logger.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';

await connectionToDB();

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(morganMiddleware);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/employee', employeeRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(
    `${chalk.green.bold('✔')} 👍 Server running in ${chalk.yellow.bold(process.env.NODE_ENV)} mode on port ${chalk.blue.bold(PORT)}`,
  );
  systemLogs.info(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`,
  );
});
