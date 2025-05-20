const {body} = require('express-validator');

const createNewFileValidator = [
  body('name').notEmpty().withMessage('File/folder name is required'),
  body('type').notEmpty().withMessage('File/folder type is required').isIn(['file', 'folder']).withMessage('Invalid file/folder type'),
]

const addContributorValidator = [
  body('userId').notEmpty().withMessage('Collaborator ID is required'),
  body('access').notEmpty().withMessage('Access type is required').isIn(['read', 'read/write']).withMessage('Invalid access type'),
]

module.exports = {
  createNewFileValidator,
  addContributorValidator
};