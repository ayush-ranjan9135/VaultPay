const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: String,
  clientId: mongoose.Schema.Types.ObjectId,
});
const Invoice = mongoose.model('Invoice', invoiceSchema);

const userSchema = new mongoose.Schema({
  email: String,
});
const User = mongoose.model('User', userSchema);

const cleanupDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

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
