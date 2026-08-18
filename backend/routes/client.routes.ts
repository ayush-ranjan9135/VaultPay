import { Router } from 'express';
import { getDashboardStats, getInvoices, getInvoiceById, payInvoice } from '../controllers/client.controller';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.use(requireAuth);
router.use(requireRole('CLIENT'));

router.get('/dashboard', getDashboardStats);
router.get('/invoices', getInvoices);
router.get('/invoices/:id', getInvoiceById);
router.post('/invoices/:id/pay', payInvoice);

export default router;
