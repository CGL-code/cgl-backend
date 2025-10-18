import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import healthRouter from './routes/health.routes.js';
import bookRouter from './routes/book.routes.js';

const app = express();

// Core middleware
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan(process.env.LOG_LEVEL || 'dev'));

// Database
connectDB();

// Routes
app.use('/api/health', healthRouter);
app.use('/api/books', bookRouter);

// 404
app.use((req, res) => {
  res.status(404).json({ ok: false, error: 'Not Found' });
});

export default app;
