import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    employeeId: { type: String, unique: true }, // e.g. AEC001 — auto-generated
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    profilePhoto: { type: String, default: '' },
    department: { type: String, default: '' },
    designation: { type: String, default: '' },
    techStack: [{ type: String }],
    skills: [{ type: String }],
    joiningDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['active', 'inactive', 'on_leave'],
      default: 'active',
    },
    experienceLevel: {
      type: String,
      enum: ['junior', 'mid', 'senior', 'lead', 'principal'],
      default: 'junior'
    },
    experience: { type: Number, default: 0 }, // years
    linkedinUrl: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String,
    },
    bio: { type: String, default: '' },
    documents: [
      {
        name: String,
        url: String,
        type: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    reportsTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
    status: {
      type: String,
      enum: ['active', 'inactive', 'on_leave'],
      default: 'active',
    },
  },
  { timestamps: true }
);

/* Auto-generate employeeId before first save */
employeeSchema.pre('save', async function (next) {
  if (this.isNew && !this.employeeId) {
    const count = await mongoose.model('Employee').countDocuments();
    this.employeeId = `AEC${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

export default mongoose.model('Employee', employeeSchema);
