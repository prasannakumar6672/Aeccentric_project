import mongoose from 'mongoose';

const calendarSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    allDay: { type: Boolean, default: false },
    type: { type: String, enum: ['meeting', 'deadline', 'holiday', 'event'], default: 'meeting' },
  },
  { timestamps: true }
);

export default mongoose.model('Calendar', calendarSchema);
