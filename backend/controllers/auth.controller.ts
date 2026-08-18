import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/User';
import { generateToken, setAuthCookie, clearAuthCookie } from '../utils/jwt';
import { loginSchema } from '../validators/auth.validator';
import { catchAsync } from '../middleware/errorHandler';
import { AppError } from '../utils/AppError';

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return next(new AppError('Invalid input', 400));
  }

  const { email, password } = parsed.data;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError('Invalid credentials', 401));
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return next(new AppError('Invalid credentials', 401));
  }

  const token = generateToken({ userId: user._id.toString(), role: user.role });
  setAuthCookie(res, token);

  res.json({
    success: true,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });
});

export const register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { registerSchema } = require('../validators/auth.validator');
  const parsed = registerSchema.safeParse(req.body);
  
  if (!parsed.success) {
    return next(new AppError('Invalid input', 400));
  }

  const { email, password, firstName, lastName, companyName } = parsed.data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('Email already registered', 400));
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser = new User({
    email,
    passwordHash,
    role: 'CLIENT', // All public registrations default to CLIENT
    firstName,
    lastName,
    companyName,
  });

  await newUser.save();

  const token = generateToken({ userId: newUser._id.toString(), role: newUser.role });
  setAuthCookie(res, token);

  res.status(201).json({
    success: true,
    user: {
      id: newUser._id,
      email: newUser.email,
      role: newUser.role,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
    },
  });
});

export const logout = (req: Request, res: Response) => {
  clearAuthCookie(res);
  res.json({ success: true, message: 'Logged out successfully' });
};

export const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user?.userId;
  
  if (!userId) {
    return res.json({ success: true, user: null });
  }

  const user = await User.findById(userId).select('-passwordHash');
  if (!user) {
    return res.json({ success: true, user: null });
  }

  res.json({
    success: true,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      companyName: (user as any).companyName,
    },
  });
});

export const updateMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { updateProfileSchema } = require('../validators/auth.validator');
  const parsed = updateProfileSchema.safeParse(req.body);
  
  if (!parsed.success) {
    return next(new AppError('Invalid input', 400));
  }

  const { firstName, lastName, companyName } = parsed.data;

  const user = await User.findById((req as any).user?.userId);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  user.firstName = firstName;
  user.lastName = lastName;
  if (companyName !== undefined) (user as any).companyName = companyName;

  await user.save();

  res.json({
    success: true,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      companyName: (user as any).companyName,
    },
  });
});
