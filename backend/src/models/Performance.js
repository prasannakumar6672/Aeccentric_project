import mongoose from 'mongoose';

const performanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    period: {
      type: String, // e.g. "Q1 2026"
      required: true,
    },
    score: {
      type: Number, // 1 to 100
      required: true,
      min: 0,
      max: 100,
    },
    delta: {
      type: Number, // change in score, e.g. +5 or -2
      default: 0,
    },
    feedback: {
      type: String,
      default: '',
    },
    evaluator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
    },
  },
  { timestamps: true }
);

performanceSchema.index({ employee: 1, period: 1 }, { unique: true });

export default mongoose.model('Performance', performanceSchema);
