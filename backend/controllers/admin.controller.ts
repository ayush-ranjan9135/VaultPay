import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/User';
import { Invoice } from '../models/Invoice';
import { catchAsync } from '../middleware/errorHandler';
import { AppError } from '../utils/AppError';

export const getDashboardStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const clientsCount = await User.countDocuments({ role: 'CLIENT' });
  const invoicesCount = await Invoice.countDocuments();
  
  const invoices = await Invoice.find();
  
  let totalRevenue = 0;
  let outstandingAmount = 0;
  
  let paidInvoicesCount = 0;
  let outstandingInvoicesCount = 0;

  invoices.forEach(inv => {
    if (inv.status === 'PAID') {
      totalRevenue += inv.total;
      paidInvoicesCount++;
    } else if (['PENDING', 'OVERDUE'].includes(inv.status)) {
      outstandingAmount += inv.total;
      outstandingInvoicesCount++;
    }
  });

  res.json({
    success: true,
    stats: {
      clientsCount,
      invoicesCount,
      paidInvoicesCount,
      outstandingInvoicesCount,
      totalRevenue,
      outstandingAmount,
    }
  });
});

export const getClients = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const clients = await User.find({ role: 'CLIENT' }).select('-passwordHash');
  res.json({ success: true, clients });
});

export const createClient = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, firstName, lastName, companyName } = req.body;
  
  const existing = await User.findOne({ email });
  if (existing) {
    return next(new AppError('Email already in use', 400));
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const newClient = new User({
    email,
    passwordHash,
    role: 'CLIENT',
    firstName,
    lastName,
    companyName,
  });

  await newClient.save();

  res.status(201).json({
    success: true,
    client: {
      id: newClient._id,
      email: newClient.email,
      firstName: newClient.firstName,
      lastName: newClient.lastName,
    }
  });
});

export const createInvoice = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { clientId, dueDate, items, notes } = req.body;
  
  let subtotal = 0;
  items.forEach((item: any) => {
    subtotal += item.amount;
  });
  
  const tax = Math.round(subtotal * 0.1); // example 10% tax
  const total = subtotal + tax;

  const count = await Invoice.countDocuments();
  const invoiceNumber = `INV-${String(count + 1).padStart(5, '0')}`;

  const invoice = new Invoice({
    invoiceNumber,
    clientId,
    issueDate: new Date(),
    dueDate,
    status: 'DRAFT',
    subtotal,
    tax,
    total,
    items,
    notes,
    createdBy: (req as any).user.userId,
  });

  await invoice.save();
  res.status(201).json({ success: true, invoice });
});

export const getInvoicesAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const invoices = await Invoice.find().populate('clientId', 'firstName lastName email companyName').sort({ createdAt: -1 });
  res.json({ success: true, invoices });
});

export const getInvoiceByIdAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const invoice = await Invoice.findById(req.params.id).populate('clientId', 'firstName lastName email companyName address');
  if (!invoice) {
    return next(new AppError('Invoice not found', 404));
  }
  res.json({ success: true, invoice });
});

export const updateInvoiceAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { dueDate, items, notes, status } = req.body;
  const invoice = await Invoice.findById(req.params.id);

  if (!invoice) {
    return next(new AppError('Invoice not found', 404));
  }

  if (items && Array.isArray(items)) {
    let subtotal = 0;
    items.forEach((item: any) => {
      subtotal += item.amount;
    });
    
    const tax = Math.round(subtotal * 0.1);
    const total = subtotal + tax;

    invoice.items = items;
    invoice.subtotal = subtotal;
    invoice.tax = tax;
    invoice.total = total;
  }

  if (dueDate) invoice.dueDate = dueDate;
  if (notes !== undefined) invoice.notes = notes;
  if (status) invoice.status = status;

  await invoice.save();
  res.json({ success: true, invoice });
});
