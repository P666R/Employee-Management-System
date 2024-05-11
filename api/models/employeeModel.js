import mongoose from 'mongoose';
import validator from 'validator';

const { Schema } = mongoose;

const employeeSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
      validate: {
        validator: function (value) {
          return /^[a-zA-Z\s]+$/.test(value);
        },
        message: 'Name should contain only letters and spaces',
      },
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, 'Please provide an email'],
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    mobile: {
      type: String,
      required: [true, 'Please provide a mobile number'],
      validate: {
        validator: (value) => validator.isMobilePhone(value, 'en-IN'),
        message: 'Please provide a valid Indian mobile number',
      },
    },
    designation: {
      type: String,
      enum: ['HR', 'Manager', 'Sales'],
      required: [true, 'Please select a designation'],
    },
    gender: {
      type: String,
      enum: ['M', 'F'],
      required: [true, 'Please select a gender'],
    },
    course: {
      type: [String],
      enum: ['MCA', 'BCA', 'BSC'],
      required: [true, 'Please select at least one course'],
    },
    image: {
      type: String,
      validate: {
        validator: (value) => {
          if (!validator.isURL(value)) {
            return false;
          }
          const fileExtension = value.split('.').pop().toLowerCase();
          return ['jpg', 'png', 'jpeg'].includes(fileExtension);
        },
        message: 'Only JPG, PNG, or JPEG files allowed',
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

employeeSchema.index({ name: 1 }, { mobile: 1 });

employeeSchema.pre('save', function (next) {
  const formattedName = this.name
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map((name) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase())
    .join(' ');

  this.name = formattedName;
  next();
});

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;
