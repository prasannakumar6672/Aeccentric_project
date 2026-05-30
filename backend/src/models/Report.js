import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ['Workforce', 'Financial', 'System Audit'], required: true },
    creator: { type: String, default: 'System' },
    status: { type: String, enum: ['Generated', 'Pending', 'Failed'], default: 'Generated' },
    url: { type: String, default: '' },
    size: { type: String, default: '0 KB' },
  },
  { timestamps: true }
);

export default mongoose.model('Report', reportSchema);
