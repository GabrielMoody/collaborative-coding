const { User } = require('../model/User');
const NotFoundError = require('../errors/NotFoundError');

const findUserByName = async (username) => {
  try {
    const user = await User.find(
      { username : { $regex: username, $options: 'i' } }, 
      { password: 0, __v: 0 });

    if (user.length < 1) {
      throw new NotFoundError('User not found');
    }

    return user;
  } catch (error) {
    console.error('Error finding user:', error);
    throw new NotFoundError('User not found');
  }
}

module.exports = {
  findUserByName,
};