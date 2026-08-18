import { Request, Response, NextFunction } from 'express';
import { Invoice } from '../models/Invoice';
import { catchAsync } from '../middleware/errorHandler';
import { AppError } from '../utils/AppError';

export const getDashboardStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user.userId;
  const invoices = await Invoice.find({ clientId: userId });
  
  let totalAmount = 0;
  let paidAmount = 0;
  let pendingAmount = 0;
  let totalInvoices = invoices.length;

  invoices.forEach(inv => {
    totalAmount += inv.total;
    if (inv.status === 'PAID') {
      paidAmount += inv.total;
    } else if (['PENDING', 'OVERDUE'].includes(inv.status)) {
      pendingAmount += inv.total;
    }
  });

  res.json({
    success: true,
    stats: {
      totalAmount,
      paidAmount,
      pendingAmount,
      totalInvoices,
    }
  });
});

export const getInvoices = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user.userId;
  const invoices = await Invoice.find({ clientId: userId }).sort({ createdAt: -1 });
  res.json({ success: true, invoices });
});

export const getInvoiceById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user.userId;
  const { id } = req.params;

  // IDOR PROTECTION: Must match clientId
  const invoice = await Invoice.findOne({ _id: id as any, clientId: userId });
  
  if (!invoice) {
    return next(new AppError('Invoice not found', 404));
  }

  res.json({ success: true, invoice });
});

export const payInvoice = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user.userId;
  const { id } = req.params;

  const invoice = await Invoice.findOne({ _id: id as any, clientId: userId }).populate('clientId', 'email');
  
  if (!invoice) {
    return next(new AppError('Invoice not found', 404));
  }

  if (invoice.status === 'PAID') {
    return next(new AppError('Invoice is already paid', 400));
  }

  // Require stripe.service here to avoid circular dependencies if any
  const { stripe } = require('../services/stripe.service');
  const { env } = require('../config/env');

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    customer_email: (invoice.clientId as any).email,
    line_items: [
      {
        price_data: {
          currency: invoice.currency.toLowerCase(),
          product_data: {
            name: `Invoice ${invoice.invoiceNumber}`,
            description: invoice.notes || 'VaultPay Invoice',
          },
          unit_amount: invoice.total, // In cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${env.CLIENT_URL}/client/invoices?payment=success&invoice_id=${invoice._id}`,
    cancel_url: `${env.CLIENT_URL}/client/invoices?payment=cancelled&invoice_id=${invoice._id}`,
    client_reference_id: invoice._id.toString(), // critical for webhook
    metadata: {
      invoiceId: invoice._id.toString(),
      clientId: userId,
    }
  });

  res.json({ success: true, checkoutUrl: session.url });
});

export const downloadInvoicePdf = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user.userId;
  const { id } = req.params;

  const invoice = await Invoice.findOne({ _id: id as any, clientId: userId }).populate('clientId', 'email');
  
  if (!invoice) {
    return next(new AppError('Invoice not found', 404));
  }

  const { generateInvoicePDF } = require('../services/pdf.service');
  
  try {
    const pdfPath = await generateInvoicePDF(invoice, (invoice.clientId as any).email);
    res.download(pdfPath, `Invoice_${invoice.invoiceNumber}.pdf`);
  } catch (error) {
    next(new AppError('Failed to generate PDF', 500));
  }
});
