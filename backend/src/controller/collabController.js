const {validationResult} = require("express-validator")
const { 
  createNewFolderorFileService, 
  createProjectService, 
  addContributorsService, 
  getProjectService, 
  getAllProjectsService,
  deleteFileService,
  deleteFolderService
} = require("../service/collabService")

const deleteFolderOrFileController = async (req, res) => {
  try {
    const { fileName, type } = req.body
    const projectId = req.params[0]

    if (type === "folder") {
      await deleteFolderService(fileName, projectId)
    } else if (type === "file") {
      await deleteFileService(fileName, projectId, req.user)
    }

    res.status(200).json({
      message: "File/Folder deleted successfully",
    })

  } catch (error) {
    console.error("Error in deleteFileController:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}

const createNewFileorFolderController = async (req, res) => {
  try {
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const projectId = req.params[0]
    const folders = req.params[1] !== undefined ? req.params[1].split("/") : undefined
    const { name, type } = req.body
    
    await createNewFolderorFileService(name, projectId, folders, type, req.user)

    res.status(201).json({
      message: `${type} created successfully`,
    })

  } catch (error) {
    console.error("Error in createNewFolderController:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}

const getAllProjectsController = async (req, res) => {
  try {
    const projects = await getAllProjectsService(req.user.id)

    res.status(200).json({
      message: "Projects fetched successfully",
      data: projects,
    })

  } catch (error) {
    console.error("Error in getAllProjectsController:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}

const getProjectController = async (req, res) => {
  try {
    const { project } = req.params

    const projectData = await getProjectService(project)

    res.status(200).json({
      message: "Project fetched successfully",
      data: projectData,
    })

  } catch (error) {
    console.error("Error in getProjectService:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}

const createProjectController = async (req, res) => {
  try {
    const { name } = req.body

    await createProjectService(name, req.user)

    res.status(201).json({
      message: "Project created successfully",
    })

  } catch (error) {
    console.error("Error in createProjectController: ", error)
    return res.status(400).json({ error: error.message })
  }
}

const addContributorsController = async (req, res) => {
  try {
    const { userId, access } = req.body
    const { project } = req.params

    const projects = await addContributorsService(project, userId, access)
    if (!projects) {
      return res.status(404).json({ error: "Project not found" })
    }

    res.status(200).json({
      message: "Contributors added successfully",
    })
    
  } catch (error) {
    console.error("Error in addContributorsService:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}

module.exports = {
  createProjectController,
  createNewFileorFolderController,
  addContributorsController,
  getAllProjectsController,
  getProjectController,
  deleteFolderOrFileController,
}