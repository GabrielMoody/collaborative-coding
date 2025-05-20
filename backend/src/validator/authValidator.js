const {body} = require('express-validator');

const createUserValidator = [
  body('username').notEmpty().withMessage('username is required'),
  body('password').notEmpty().withMessage('password is required').isLength({ min: 6 }).withMessage('password must be at least 6 characters long'),
  body('password_confirmation').notEmpty().withMessage('password confirmation is required').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('password confirmation does not match password');
    }
    return true;
  })
];

module.exports = {
  createUserValidator
}