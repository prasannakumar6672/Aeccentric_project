import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    duration: {
      type: String,
      default: '30 mins',
    },
    type: {
      type: String,
      enum: ['Online', 'Room 101', 'Room 202', 'Room 303', 'Room 402'],
      default: 'Online',
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Meeting', meetingSchema);
