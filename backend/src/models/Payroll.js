import mongoose from 'mongoose';

const payrollSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    month: {
      type: String, // e.g. "2026-05"
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    allowances: {
      type: Number,
      default: 0,
    },
    deductions: {
      type: Number,
      default: 0,
    },
    netPayable: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['paid', 'pending', 'processed', 'processing', 'unpaid'],
      default: 'unpaid',
    },
    earnings: {
      basic: { type: Number, default: 0 },
      hra: { type: Number, default: 0 },
      travel: { type: Number, default: 0 },
      medical: { type: Number, default: 0 },
      bonus: { type: Number, default: 0 },
    },
    deductionBreakdown: {
      pf: { type: Number, default: 0 },
      professionalTax: { type: Number, default: 0 },
      tds: { type: Number, default: 0 },
    },
    payslipUrl: { type: String, default: '' },
    paymentMethod: { type: String, default: '' },
    paymentDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

payrollSchema.index({ employee: 1, month: 1 }, { unique: true });

export default mongoose.model('Payroll', payrollSchema);
