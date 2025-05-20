const {User} = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const CustomError = require('../errors/CustomError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');

require('dotenv').config();

const createUserService = async (username, password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({username, password: hashedPassword});
    await newUser.save();
    return newUser.username;
  } catch (error) {
    throw new CustomError('Error creating user: ' + error.message, statusCode = 500);
  }
}

const userLoginService = async (username, password) => {
  try {
    const user = await User.findOne({username});

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid) {
      throw new UnauthorizedError('Password is incorrect');
    }

    const token = jwt.sign({id: user._id, name: user.username}, process.env.JWT_SECRET, {expiresIn: '1h'});
    return token;
  } catch (error) {
    throw new CustomError('Error logging in: ' + error.message);
  }
}

module.exports = {
  createUserService,
  userLoginService
}