import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../../models/userModel.js';
import { systemLogs } from '../../utils/logger.js';

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error('Please provide an username and password');
  }

  const existingUser = await User.findOne({ username }).select('+password');

  if (!existingUser || !(await existingUser.comparePassword(password))) {
    res.status(401);
    systemLogs.error('Incorrect username or password');
    throw new Error('Incorrect username or password');
  }

  if (existingUser && (await existingUser.comparePassword(password))) {
    const accessToken = jwt.sign(
      {
        id: existingUser._id,
        roles: existingUser.roles,
      },
      process.env.JWT_ACCESS_SECRET_KEY,
      { expiresIn: '1h' },
    );

    const newRefreshToken = jwt.sign(
      {
        id: existingUser._id,
      },
      process.env.JWT_REFRESH_SECRET_KEY,
      { expiresIn: '1d' },
    );

    const { cookies } = req;

    let newRefreshTokenArray = !cookies?.jwt
      ? existingUser.refreshToken
      : existingUser.refreshToken.filter((refT) => refT !== cookies.jwt);

    if (cookies?.jwt) {
      const refreshToken = cookies.jwt;

      const existingRefreshToken = await User.findOne({
        refreshToken,
      }).exec();

      if (!existingRefreshToken) {
        newRefreshTokenArray = [];
      }

      const options = {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        secure: true,
        sameSite: 'None',
      };

      res.clearCookie('jwt', options);
    }

    existingUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    await existingUser.save();

    const options = {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: 'None',
    };

    res.cookie('jwt', newRefreshToken, options);

    res.json({
      success: true,
      username: existingUser.username,
      accessToken,
    });
  } else {
    res.status(401);
    throw new Error('Invalid credentials provided');
  }
});

export default loginUser;
