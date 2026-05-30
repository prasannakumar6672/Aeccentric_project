import mongoose from 'mongoose';

const securitySchema = new mongoose.Schema(
  {
    event: { type: String, required: true }, // e.g. Login Success, Password Change, API Key Generated
    severity: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
    ipAddress: { type: String, default: 'unknown' },
    userEmail: { type: String, required: true },
    status: { type: String, enum: ['Resolved', 'Flagged', 'Blocked'], default: 'Resolved' },
  },
  { timestamps: true }
);

export default mongoose.model('Security', securitySchema);
