import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
    },
    action: {
      type: String,
      required: true,
    },
    details: {
      type: String,
    },
    department: {
      type: String,
      default: 'General',
    },
  },
  { timestamps: true }
);

export default mongoose.model('ActivityLog', activityLogSchema);
