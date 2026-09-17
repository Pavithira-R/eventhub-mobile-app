import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || '*';

// Cross-Origin Resource Sharing (CORS) Configuration
app.use(
  cors({
    origin: CLIENT_ORIGIN === '*' ? true : CLIENT_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id', 'x-user-email'],
  })
);

// Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (process.env.NODE_ENV !== 'test') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// API Root Information Route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to EventHub REST API Server',
    documentation: {
      health: 'GET /api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile, PUT /api/auth/profile',
      },
      events: {
        list: 'GET /api/events?search=&category=',
        details: 'GET /api/events/:id',
        create: 'POST /api/events (organizer role required)',
        update: 'PUT /api/events/:id (organizer role required)',
        delete: 'DELETE /api/events/:id (organizer role required)',
      },
      bookings: {
        list: 'GET /api/bookings',
        details: 'GET /api/bookings/:id',
        create: 'POST /api/bookings',
        cancel: 'DELETE /api/bookings/:id',
      },
    },
  });
});

// Mount Central API Routes
app.use('/api', apiRouter);

// 404 Route Handler
app.use(notFoundHandler);

// Centralized Error Handling Middleware
app.use(errorHandler);

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 EventHub REST API Server Running!`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`=========================================`);
  });
}

export default app;
