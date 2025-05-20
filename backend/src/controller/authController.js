const {validationResult} = require("express-validator")

const {createUserService, userLoginService} = require('../service/authService');

const createUserController = async (req, res, next) => { 
  try {
    const {username, password} = req.body;
    
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const newUser = await createUserService(username, password);
    
    res.status(201).json({message: 'User created successfully', user: newUser});
  } catch (error) {
    next(error);
  }
}

const userLoginController = async (req, res) => {
  try {
    const {username, password} = req.body;
    
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const token = await userLoginService(username, password);
    
    res.status(200).json({message: 'User logged in successfully', access_token: token});
  } catch (error) {
    return res.status(error.statusCode).json({
      message: error.message || 'Internal Server Error' 
    });
  }
}

module.exports = {
  createUserController,
  userLoginController
}