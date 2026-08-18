import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { IInvoice } from '../models/Invoice';

export const generateInvoicePDF = (invoice: IInvoice, clientEmail: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      
      const dir = path.join(__dirname, '../../temp');
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const filePath = path.join(dir, `${invoice.invoiceNumber}.pdf`);
      const stream = fs.createWriteStream(filePath);
      
      doc.pipe(stream);

      // Header
      doc.fontSize(20).text('VaultPay', 50, 50);
      doc.fontSize(10).text('123 Financial Way', 50, 75);
      doc.text('New York, NY 10001', 50, 90);

      // Invoice metadata
      doc.fontSize(20).text('INVOICE', 400, 50, { align: 'right' });
      doc.fontSize(10).text(`Invoice Number: ${invoice.invoiceNumber}`, 400, 80, { align: 'right' });
      doc.text(`Issue Date: ${invoice.issueDate.toDateString()}`, 400, 95, { align: 'right' });
      doc.text(`Due Date: ${invoice.dueDate.toDateString()}`, 400, 110, { align: 'right' });

      doc.moveDown(3);
      doc.text(`Bill To: ${clientEmail}`, 50, 150);

      // Paid Stamp
      if (invoice.status === 'PAID') {
        doc.fontSize(30).fillColor('green').text('PAID', 250, 150, { align: 'center' });
        doc.fillColor('black'); // reset
      }

      doc.moveDown(4);

      // Table Header
      let y = doc.y;
      doc.fontSize(10).text('Description', 50, y);
      doc.text('Qty', 300, y);
      doc.text('Unit Price', 350, y);
      doc.text('Amount', 450, y);

      doc.moveTo(50, y + 15).lineTo(500, y + 15).stroke();
      doc.moveDown(1);
      
      // Items
      y = doc.y + 10;
      invoice.items.forEach(item => {
        doc.text(item.description, 50, y);
        doc.text(item.quantity.toString(), 300, y);
        doc.text(`$${(item.unitPrice / 100).toFixed(2)}`, 350, y);
        doc.text(`$${(item.amount / 100).toFixed(2)}`, 450, y);
        y += 20;
      });

      doc.moveTo(50, y).lineTo(500, y).stroke();
      
      // Totals
      y += 15;
      doc.text('Subtotal:', 350, y);
      doc.text(`$${(invoice.subtotal / 100).toFixed(2)}`, 450, y);
      
      y += 20;
      doc.text('Tax:', 350, y);
      doc.text(`$${(invoice.tax / 100).toFixed(2)}`, 450, y);
      
      y += 20;
      doc.fontSize(12).text('Total:', 350, y);
      doc.text(`$${(invoice.total / 100).toFixed(2)}`, 450, y);

      doc.end();

      stream.on('finish', () => {
        resolve(filePath);
      });

    } catch (error) {
      reject(error);
    }
  });
};
