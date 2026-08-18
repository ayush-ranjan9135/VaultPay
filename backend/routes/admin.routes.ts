import { Router } from 'express';
import { getDashboardStats, getClients, createClient, updateClientAdmin, getInvoicesAdmin, createInvoice, getInvoiceByIdAdmin, updateInvoiceAdmin } from '../controllers/admin.controller';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.use(requireAuth);
router.use(requireRole('ADMIN'));

router.get('/dashboard', getDashboardStats);
router.get('/clients', getClients);
router.post('/clients', createClient);
router.put('/clients/:id', updateClientAdmin);

router.get('/invoices', getInvoicesAdmin);
router.post('/invoices', createInvoice);
router.get('/invoices/:id', getInvoiceByIdAdmin);
router.put('/invoices/:id', updateInvoiceAdmin);

export default router;
