const express = require('express');
const router = express.Router();
const { getAllProjectsController,createProjectController, getProjectController, createNewFileorFolderController, addContributorsController } = require('../controller/collabController');
const { createNewFileValidator, addContributorValidator } = require('../validator/collabsValidator');
const {validateToken} = require('../middleware/jwt');

router.use(validateToken);

router.post('/projects', createProjectController);
router.post('/projects/:project/add', addContributorValidator, addContributorsController);
router.post(/^\/projects\/([^/]+)\/path(?:\/(.*))?\/create$/, createNewFileValidator, createNewFileorFolderController);
router.get('/projects/:project', getProjectController);
router.get('/projects/', getAllProjectsController);

module.exports = router;