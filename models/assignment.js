// import mongoose odm module
const mongoose = require('mongoose');

const multer = require('multer');
const path = require('path');
const ASSIGN_PATH = path.join('/students/submissions');
// creating the asset schema
const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    students: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        status: {
          type: String,
          default: 'Evalutation Pending',
        },
        upload: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', ASSIGN_PATH));
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now());
  },
});

// static
assignmentSchema.statics.uploadedAssignment = multer({
  storage: storage,
}).single('upload');
assignmentSchema.statics.assignPath = ASSIGN_PATH;

// creating model from schema
const Assignment = mongoose.model('Assignment', assignmentSchema);

// export the model
module.exports = Assignment;
