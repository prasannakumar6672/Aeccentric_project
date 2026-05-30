import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Applied', 'Interviewing', 'Offered', 'Hired', 'Rejected'],
      default: 'Applied',
    },
    date: {
      type: String, // e.g. "2h ago", "Yesterday", "2 days ago"
      default: 'Just now',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Candidate', candidateSchema);
