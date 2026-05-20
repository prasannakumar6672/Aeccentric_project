import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String, required: true, unique: true, lowercase: true, trim: true,
    },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ['super_admin', 'admin', 'hr', 'manager', 'employee'],
      default: 'employee',
    },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    refreshToken: { type: String, select: false },
    passwordResetOTP: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    lastLogin: Date,
  },
  { timestamps: true }
);

/* Hash password before save */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/* Compare plain password with hash */
userSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.password);
};

export default mongoose.model('User', userSchema);
