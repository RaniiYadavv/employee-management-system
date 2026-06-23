const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters'],
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    mobileNumber: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
      match: [/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
      enum: {
        values: [
          'Engineering',
          'Human Resources',
          'Sales',
          'Marketing',
          'Finance',
          'Operations',
          'Customer Support',
          'IT',
          'Other',
        ],
        message: '{VALUE} is not a supported department',
      },
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
      trim: true,
      maxlength: [100, 'Designation cannot exceed 100 characters'],
    },
    joiningDate: {
      type: Date,
      required: [true, 'Joining date is required'],
      validate: {
        validator: (value) => value <= new Date(),
        message: 'Joining date cannot be in the future',
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Text index to support fast name search
employeeSchema.index({ fullName: 'text' });
// Helpful compound index for common sort/filter combinations
employeeSchema.index({ department: 1, joiningDate: -1 });

module.exports = mongoose.model('Employee', employeeSchema);
