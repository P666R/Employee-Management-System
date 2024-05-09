import asyncHandler from 'express-async-handler';
import User from '../../models/userModel.js';

const registerUser = asyncHandler(async (req, res) => {
  const { username, password, passwordConfirm } = req.body;

  if (!username) {
    res.status(400);
    throw new Error('A username is required');
  }

  if (!password) {
    res.status(400);
    throw new Error('You must enter a password');
  }

  if (!passwordConfirm) {
    res.status(400);
    throw new Error('Confirm password field is required');
  }

  const userExists = await User.findOne({ username });

  if (userExists) {
    res.status(400);
    throw new Error(
      'The username you entered is already taken. Please try another one',
    );
  }

  const newUser = new User({
    username,
    password,
    passwordConfirm,
  });

  const registeredUser = await newUser.save();

  if (!registeredUser) {
    res.status(400);
    throw new Error('User could not be registered');
  }

  if (registeredUser) {
    res.json({
      success: true,
      message: `A new user ${registeredUser.username} has been registered!`,
    });
  }
});

export default registerUser;
