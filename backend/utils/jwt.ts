import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { Response } from 'express';

export interface JwtPayload {
  userId: string;
  role: 'ADMIN' | 'CLIENT';
}

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '1d' });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
};

export const setAuthCookie = (res: Response, token: string) => {
  const isProd = env.NODE_ENV === 'production' || env.CLIENT_URL.startsWith('https');
  res.cookie('token', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
};

export const clearAuthCookie = (res: Response) => {
  const isProd = env.NODE_ENV === 'production' || env.CLIENT_URL.startsWith('https');
  res.cookie('token', '', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'strict',
    expires: new Date(0),
  });
};
