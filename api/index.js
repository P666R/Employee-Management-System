import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import http from 'http';

dotenv.config();

const app = express();

const port = process.env.PORT || 4000;
const DB = process.env.MONGODB_URL;
const server = http.createServer(app);

const startServer = async () => {
  try {
    await mongoose.connect(DB);
    console.log('Database successfully connected...');
    server.listen(port, () => {
      console.log(`Server running on port: ${port}...`);
    });
  } catch (err) {
    console.log(err.name, err.message);
  }
};

startServer();
