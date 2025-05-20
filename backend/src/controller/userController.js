const { findUserByName } = require('../service/userService');

const findUserByNameController = async (req, res) => {
  try {
    const users = await findUserByName(req.query.username);

    return res.status(200).json({
      users: users
    });
  } catch(error) {
    console.error('Error in findUserByNameController:', error);
    return res.status(error.statusCode).json({
      message: error.message || 'Internal Server Error' 
    });
  }
}

module.exports = {
  findUserByNameController,
};