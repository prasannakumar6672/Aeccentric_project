import mongoose from 'mongoose';

const financeSchema = new mongoose.Schema(
  {
    category: { type: String, required: true }, // e.g. Payroll, Software, Office, Consulting
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['expense', 'income'], required: true },
    status: { type: String, enum: ['Completed', 'Pending', 'Failed'], default: 'Completed' },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('Finance', financeSchema);
