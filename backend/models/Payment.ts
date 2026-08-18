import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  invoiceId: mongoose.Types.ObjectId;
  clientId: mongoose.Types.ObjectId;
  stripePaymentIntentId: string;
  stripeCheckoutSessionId?: string;
  amount: number; // Stored in cents
  currency: string;
  status: 'PENDING' | 'SUCCEEDED' | 'FAILED';
  paidAt?: Date;
  webhookEventId: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema(
  {
    invoiceId: { type: Schema.Types.ObjectId, ref: 'Invoice', required: true, index: true },
    clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    stripePaymentIntentId: { type: String, required: true, index: true },
    stripeCheckoutSessionId: { type: String },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: 'USD' },
    status: {
      type: String,
      enum: ['PENDING', 'SUCCEEDED', 'FAILED'],
      default: 'PENDING',
    },
    paidAt: { type: Date },
    webhookEventId: { type: String, required: true, unique: true, index: true }, // For idempotency
  },
  { timestamps: true }
);

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
