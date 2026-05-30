import mongoose from 'mongoose';

const aiCopilotSchema = new mongoose.Schema(
  {
    prompt: { type: String, required: true },
    response: { type: String, required: true },
    category: { type: String, default: 'General' },
    rating: { type: Number, default: 0 }, // e.g. 1-5
  },
  { timestamps: true }
);

export default mongoose.model('AICopilot', aiCopilotSchema);
