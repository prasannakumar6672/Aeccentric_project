import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender: { type: String, required: true },
    recipient: { type: String, default: 'All Admins' },
    subject: { type: String, required: true },
    content: { type: String, required: true },
    read: { type: Boolean, default: false },
    avatar: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Message', messageSchema);
