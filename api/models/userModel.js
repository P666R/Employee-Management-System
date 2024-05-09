import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import validator from 'validator';

import { USER } from '../constants/index.js';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: function (value) {
          return /^[A-z][A-z0-9-_]{3,23}$/.test(value);
        },
        message:
          'Username must be alphanumeric, without special characters.Hypens and underscores are allowed.',
      },
    },
    password: {
      type: String,
      select: false,
      validate: [
        validator.isStrongPassword,
        'Password must be at least 8 characters long, with at least 1 uppercase and lowercase letters and at least 1 symbol',
      ],
    },
    passwordConfirm: {
      type: String,
      validate: {
        validator: function (value) {
          return value === this.password;
        },
        message: 'Passwords do not match',
      },
    },
    roles: {
      type: [String],
      default: [USER],
    },
    refreshToken: [String],
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  if (this.roles.length === 0) {
    this.roles.push(USER);
    next();
  }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.comparePassword = async function (givenPassword) {
  return await bcrypt.compare(givenPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
