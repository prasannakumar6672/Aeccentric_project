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
      zip: String,
      zipCode: String,
      country: String,
    },
    emergencyContact: {
      name: String,
      relation: String,
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
    salary: { type: Number, default: 0 },
    performanceScore: { type: Number, default: 85 },
    leaveBalance: {
      sick: { type: Number, default: 12 },
      annual: { type: Number, default: 15 },
      casual: { type: Number, default: 10 },
    },
  },
  { timestamps: true }
);

/* Auto-generate employeeId before first save */
employeeSchema.pre('save', async function (next) {
  if (this.isNew && !this.employeeId) {
    let nextIdNumber = 1;
    const lastEmployee = await mongoose.model('Employee')
      .findOne({}, { employeeId: 1 })
      .sort({ employeeId: -1 });
    
    if (lastEmployee && lastEmployee.employeeId) {
      const match = lastEmployee.employeeId.match(/\d+/);
      if (match) {
        nextIdNumber = parseInt(match[0], 10) + 1;
      }
    }
    
    // Just in case of collision, keep incrementing until unique
    let unique = false;
    while (!unique) {
      const candidateId = `AEC${String(nextIdNumber).padStart(3, '0')}`;
      const existing = await mongoose.model('Employee').findOne({ employeeId: candidateId });
      if (!existing) {
        this.employeeId = candidateId;
        unique = true;
      } else {
        nextIdNumber++;
      }
    }
  }
  next();
});

employeeSchema.index({ status: 1, department: 1 });
employeeSchema.index({ fullName: 'text', employeeId: 'text', designation: 'text' });
employeeSchema.index({ reportsTo: 1 });

export default mongoose.model('Employee', employeeSchema);
