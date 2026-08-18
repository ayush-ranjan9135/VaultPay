import { Request, Response } from 'express';
import { stripe } from '../services/stripe.service';
import { env } from '../config/env';
import { Payment } from '../models/Payment';
import { Invoice } from '../models/Invoice';
import { User } from '../models/User';
import { generateInvoicePDF } from '../services/pdf.service';
import { sendEmail } from '../services/email.service';

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    // Note: req.body must be raw buffer for stripe.webhooks.constructEvent to work
    // We configured this in app.ts using express.raw() or bypassing json()
    event = stripe.webhooks.constructEvent(req.body, sig as string, env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error(`⚠️  Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    
    const webhookEventId = event.id; // Unique event ID from Stripe
    const invoiceId = session.metadata.invoiceId;
    const clientId = session.metadata.clientId;
    const paymentIntentId = session.payment_intent;
    const amount = session.amount_total; // in cents
    const currency = session.currency;

    try {
      // 1. Idempotency Check
      const existingPayment = await Payment.findOne({ webhookEventId });
      if (existingPayment) {
        console.log(`Payment for event ${webhookEventId} already processed. Ignoring.`);
        return res.json({ received: true, status: 'already_processed' });
      }

      // 2. Create Payment Record
      const payment = new Payment({
        invoiceId,
        clientId,
        stripePaymentIntentId: paymentIntentId,
        stripeCheckoutSessionId: session.id,
        amount,
        currency,
        status: 'SUCCEEDED',
        paidAt: new Date(),
        webhookEventId,
      });

      await payment.save();

      // 3. Update Invoice Status
      const invoice = await Invoice.findByIdAndUpdate(
        invoiceId,
        { status: 'PAID' },
        { new: true }
      );

      if (!invoice) {
        console.error(`Invoice ${invoiceId} not found during webhook processing`);
        return res.status(404).send('Invoice not found');
      }

      // 4. PDF Generation & Email Delivery
      const client = await User.findById(clientId);
      if (client) {
        const pdfPath = await generateInvoicePDF(invoice, client.email);
        
        const emailHtml = `
          <h2>Payment Receipt for Invoice ${invoice.invoiceNumber}</h2>
          <p>Thank you for your payment of $${(amount / 100).toFixed(2)}.</p>
          <p>Please find your receipt attached.</p>
        `;

        await sendEmail(client.email, `Receipt for Invoice ${invoice.invoiceNumber}`, emailHtml, pdfPath);
      }

      console.log(`✅ Payment successful for invoice ${invoiceId}`);
    } catch (error) {
      console.error('Error processing webhook event:', error);
      // We return 500 so Stripe retries if it was a transient error (e.g., DB down)
      // But if email failed, we shouldn't fail the whole payment. We handled email errors internally.
      return res.status(500).send('Internal Server Error');
    }
  }

  // Return a 200 response to acknowledge receipt of the event
  res.json({ received: true });
};
