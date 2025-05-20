const {Schema, model} = require("mongoose")
const { v4: uuidv4 } = require("uuid")

const FileMetaDataSchema = new Schema({
  _id: {type: String, required: true, default: uuidv4},
  name: {type: String, required: true, unique: true},
  parentId: {type: String, required: false},
  projectId: {type: String, required: false},
  type: {type: String, required: true},
  sharedbId: {type: String, required: false},
  ownerID: {type: String, required: true},
  collaborators: {type: [{
    userId: {type: String, required: true},
    access: {type: String, required: true, enum: ['read', 'read/write']}
  }], required: true, default: [], 
    validate: {
      validator: function (array) {
        const ids = array.map(item => item.id);
        return ids.length === new Set(ids).size;
      },
      message: 'Duplicate entries are not allowed in collaboratorsID',
    },
  },
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
})

FileMetaDataSchema.index({ _id: 1, name: 1, ownerID: 1}, { unique: true })
const FileMeta = model("files_meta", FileMetaDataSchema)

module.exports = { FileMeta }