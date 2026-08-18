import Stripe from 'stripe';
import { env } from '../config/env';

export const stripe: Stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-07-29.dahlia' as any,
});
