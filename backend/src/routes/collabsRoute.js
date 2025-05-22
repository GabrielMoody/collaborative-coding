const express = require('express');
const router = express.Router();
const { deleteFolderOrFileController, getAllProjectsController,createProjectController, getProjectController, createNewFileorFolderController, addContributorsController } = require('../controller/collabController');
const { createNewFileValidator, addContributorValidator } = require('../validator/collabsValidator');
const {validateToken} = require('../middleware/jwt');

router.use(validateToken);

router.get('/projects/', getAllProjectsController);
router.post('/projects', createProjectController);
router.get('/projects/:project', getProjectController);

router.post('/projects/:project/add', addContributorValidator, addContributorsController);
router.post(/^\/projects\/([^/]+)\/path(?:\/(.*))?\/create$/, createNewFileValidator, createNewFileorFolderController);

router.delete(/^\/projects\/([^/]+)\/path(?:\/(.*))?\/delete$/, deleteFolderOrFileController);

module.exports = router;