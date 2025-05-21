const mongoose = require("mongoose")
const { v4: uuidv4 } = require("uuid")

const { connection } = require("../config/sharedb")
const { FileMeta } = require("../model/FileMetaData")
const { User } = require("../model/User")

const NotFoundError = require("../errors/NotFoundError")

const createProjectService = async (projectName, user) => {
  try {
    const fileMetaData = new FileMeta({
      name: projectName,
      type: "project",
      ownerID: user.id,
    })
  
    await fileMetaData.save()
  } catch (error) {
    if (error.code === 11000) {
      console.error("Project already exists:", error)
      throw new Error('Project already exists')
    }

    console.error("Error creating project:", error)
    throw new Error('Error creating project: ' + error.message)
  }
}

const getAllProjectsService = async (userId) => {
  try {
    const projects = await FileMeta.find({ 
      $or: [{ownerID: userId}, {"collaborators.userId": userId}], type: "project" }, "_id name createdAt")

    if (!projects || projects.length === 0) {
      throw new NotFoundError('No projects found')
    }

    return projects;
  } catch (error) {
    console.error("Error fetching all projects:", error)
  }
}

const getProjectService = async (projectId) => {
  try {
    const project = await FileMeta.aggregate([
      {
        $match: {
          _id: projectId,
          type: "project"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "ownerID",
          foreignField: "_id",
          as: "owner"
        },
      },
      {
        $unwind: '$owner'
      },
      {
        $lookup: {
          from: "users",
          localField: "collaborators.userId",
          foreignField: "_id",
          as: "collaborators"
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          type: 1,
          owner: {
            _id: "$owner._id",
            username: "$owner.username",
          },
          collaborators: {
            $map: {
              input: "$collaborators",
              as: "collaborator",
              in: {
                _id: "$$collaborator._id",
                username: "$$collaborator.username",
              }
            }
          }
        }
      }
    ])

    if (!project) {
      throw new Error('Project not found')
    }
    
    const projects = await FileMeta.find({ projectId: project[0]._id}, "_id name type parentId createdAt")
    
    const files = buildTree(projects, null)
    const result = {
      project: project[0].name,
      files: files,
      owner: project[0].owner,
      collaborators: project[0].collaborators  
    }
    return result;
  } catch (error) {
    console.error("Error fetching project:", error)
    throw new Error('Error fetching project: ' + error.message)
  }
}

const createNewFolderorFileService = async (name, projectId, folderId, type, user) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    if(folderId !== undefined) {
      folderId = folderId[folderId.length - 1]
    }

    const folder = await FileMeta.findOne({ name: folderId, type: "folder"}, "_id")
    const project = await FileMeta.findOne({ name: projectId, type: "project"}, "_id")

    if (!projectId) {
      throw new NotFoundError('Project was not found')
    }

    const file_meta = new FileMeta({
      _id: uuidv4(),
      name: name,
      type: type,
      parentId: folder,
      projectId: project,
      ownerID: user.id,
    })

    await file_meta.save({session})

    if(type === "file") {
      connection.agent.stream.agent = { connectSession : {userId: user.id}}
      const doc = connection.get("files", file_meta._id.toString())
      
      doc.create({content: ""}, "json0", (err) => {
        if (err) {
          console.error("Error creating document:", err);
          throw err;
        }
      });
    }
    
    await session.commitTransaction();

  } catch (error) {
    session.abortTransaction();
    if (error.code === 11000) {
      console.error("Folder/file already exists:", error)
      throw new Error('Folder/file already exists')
    }

    console.error("Error creating folder:", error)
    throw new Error('Error creating folder: ' + error.message)
  } finally {
    session.endSession();
  }
}

const addContributorsService = async (projectId, userId, access) => {
  try {
    const user = await User.findById(userId)
    if (!user) {
      throw new Error('NotFoundError')
    }

    const project = await FileMeta.findOneAndUpdate({name: projectId}, {
      $push: { collaborators: {userId: userId, access: access} },
    }, 
    { new: true })

    if (!project) {
      throw new Error('Project not found')
    }

    return project;
  } catch (error) {
    console.error("Error adding contributors:", error)
    throw new Error('Error adding contributors: ' + error.message)
  }
}

function buildTree(files, parentId = null) {
  return files
    .filter(file => file.parentId === parentId)
    .map(file => {
      const children = buildTree(files, file._id);
      return {
        id: file._id,
        name: file.name,
        type: file.type,
        projectId: file.projectId,
        createdAt: file.createdAt,
        ...(children.length > 0 ? { children } : {}),
      };
    });
}

module.exports = {
  createProjectService,
  createNewFolderorFileService,
  getProjectService,
  getAllProjectsService,
  addContributorsService
}