import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    checkIn: {
      type: Date,
    },
    checkOut: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'late', 'half_day', 'on_leave'],
      default: 'present',
    },
    workHours: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Prevent duplicate attendance records for same employee on the same calendar date (YYYY-MM-DD format check is handled in code)
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });
attendanceSchema.index({ status: 1, date: -1 });

export default mongoose.model('Attendance', attendanceSchema);
