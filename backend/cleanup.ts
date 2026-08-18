import mongoose from 'mongoose';
import { Invoice } from './models/Invoice';
import { User } from './models/User';
import { env } from './config/env';

const cleanupDatabase = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all invoices
    const invoices = await Invoice.find();
    let deletedCount = 0;

    for (const inv of invoices) {
      const user = await User.findById(inv.clientId);
      if (!user) {
        await Invoice.findByIdAndDelete(inv._id);
        deletedCount++;
        console.log(`Deleted orphaned invoice ${inv.invoiceNumber}`);
      }
    }

    console.log(`✅ Cleanup complete. Deleted ${deletedCount} orphaned invoices.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error cleaning database:', error);
    process.exit(1);
  }
};

cleanupDatabase();
