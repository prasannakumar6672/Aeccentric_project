import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: {
      type: String,
      enum: ['planning', 'active', 'review', 'in_review', 'completed', 'on_hold'],
      default: 'planning',
    },
    client: { type: String, default: '' },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    budget: { type: Number, default: 0 },
    lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }],
    startDate: { type: Date },
    endDate: { type: Date },
    color: { type: String, default: '#4f46e5' }, // indigo-600 default
  },
  { timestamps: true }
);

projectSchema.index({ status: 1, priority: 1 });
projectSchema.index({ lead: 1 });
projectSchema.index({ members: 1 });
projectSchema.index({ createdAt: -1 });

export default mongoose.model('Project', projectSchema);
