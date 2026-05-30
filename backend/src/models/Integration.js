import mongoose from 'mongoose';

const integrationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['connected', 'disconnected'], default: 'disconnected' },
    category: { type: String, default: 'General' },
    icon: { type: String, default: '' }, // Lucide icon name
  },
  { timestamps: true }
);

export default mongoose.model('Integration', integrationSchema);
