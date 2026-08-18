import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import clientRoutes from './routes/client.routes';
import { handleStripeWebhook } from './webhooks/stripe.webhook';
import { apiLimiter } from './middleware/rateLimiter';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true, // Allow cookies
}));
app.use(cookieParser());
app.use('/api', apiLimiter);

// Webhook parsing needs raw body, not JSON
// We'll handle this in the webhook route specifically, but for now we parse JSON for everything else
app.use((req, res, next) => {
  if (req.originalUrl === '/api/webhooks/stripe') {
    express.raw({ type: 'application/json' })(req, res, next);
  } else {
    express.json()(req, res, next);
  }
});

// Basic Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'VaultPay API is running' });
});

// Routes
app.post('/api/webhooks/stripe', handleStripeWebhook);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/client', clientRoutes);

import { errorHandler } from './middleware/errorHandler';
import { AppError } from './utils/AppError';

// Generic 404 Handler
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(errorHandler);

export default app;
