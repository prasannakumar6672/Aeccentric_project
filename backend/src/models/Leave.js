import mongoose from 'mongoose';

const leaveSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    type: {
      type: String,
      enum: ['sick', 'annual', 'earned', 'maternity', 'paternity', 'unpaid', 'casual', 'emergency'],
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate:   { type: Date, required: true },
    days: { type: Number, default: 1 },
    reason: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
    reviewNote: { type: String, default: '' },
  },
  { timestamps: true }
);

/* Auto-calculate days before save */
leaveSchema.pre('save', function (next) {
  if (this.startDate && this.endDate) {
    const diff = Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24)) + 1;
    this.days = Math.max(1, diff);
  }
  next();
});

leaveSchema.index({ employee: 1, status: 1, startDate: -1 });
leaveSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('Leave', leaveSchema);
