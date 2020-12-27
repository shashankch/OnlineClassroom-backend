// import assignment model
const Assignment = require('../../../models/assignment');
// import user model
const User = require('../../../models/user');

module.exports.createAssignment = async (req, res) => {
  try {
    let user = await User.findById(req.user._id);

    if (user && user.type === 'teacher' && req.body.id === req.user.id) {
      let assign = await Assignment.create({
        title: req.body.title,
        description: req.body.description,
        owner: user,
      });
      await user.assignment.push(assign);
      await user.save();
      return res.status(200).json({
        message: 'assignment created!',
        success: true,
      });
    } else {
      return res.status(401).json({
        message: 'Invalid Request',
        success: false,
      });
    }
  } catch (err) {
    // return error response on request failure
    console.log('***', err);
    return res.status(500).json({
      message: 'Internal Server Error',
      success: false,
    });
  }
};

module.exports.submitAssignment = async (req, res) => {
  try {
    let user = await User.findById(req.user._id);

    if (user && user.type === 'student' && req.body.id === req.user.id) {
      console.log('inside user', user);
      console.log('file', req.file);
      let assignment = await Assignment.findById(req.body.aid);
      if (assignment) {
        console.log('inside assignment', assignment);
        Assignment.uploadedAssignment(req, res, function (err) {
          if (err) {
            return res.status(500).json(err);
          }

          if (req.file) {
            console.log('inside file', req.file);
            assignment.students.push({
              id: req.body.id,
              status: 'submitted',
              upload: Assignment.assignPath + '/' + req.file.filename,
            });
            assignment.save();
            return res.status(200).json({
              message: 'assignment submitted!',
              success: true,
            });
          } else {
            return res.status(401).json({
              message: 'Invalid Request',
              success: false,
            });
          }
        });
      } else {
        return res.status(401).json({
          message: 'Invalid Request',
          success: false,
        });
      }
    } else {
      return res.status(401).json({
        message: 'Invalid Request',
        success: false,
      });
    }
  } catch (err) {
    // return error response on request failure
    console.log('***', err);
    return res.status(500).json({
      message: 'Internal Server Error',
      success: false,
    });
  }
};

module.exports.getAllAssignments = async (req, res) => {
  try {
    let assignments = await Assignment.find({})
      .sort('createdAt')
      .populate('students');

    return res.status(200).json({
      message: 'list of assignments',
      assignments: assignments,
    });
  } catch (error) {
    // send error response on req fail
    console.log('***', err);
    return res.json(500, {
      message: 'Internal Server Error',
    });
  }
};

module.exports.evaluateAssignments = async (req, res) => {
  try {
    let user = await User.findById(req.body.id);
    if (user && user.type === 'teacher' && req.body.id === req.user.id) {
      let assignment = await Assignment.findById(req.body.aid);
      let std = await User.findById(req.body.sid);
      let exists = false;
      // let aid=null;
      if (assignment && std) {
        for (let obj of assignment.students) {
          if (obj.id == req.body.sid) {
            exists = true;
            obj.status = req.body.grade;
            await assignment.save();
            break;
          }
        }

        if (exists) {
          return res.status(200).json({
            data: {
              assignment: assignment,
            },
            message: 'Assignemnt Evaluated',
            success: true,
          });
        } else {
          return res.status(200).json({
            message: 'Not submitted',
            success: false,
          });
        }
      } else {
        return res.status(401).json({
          message: 'Invalid Request',
          success: false,
        });
      }
    } else {
      return res.status(401).json({
        message: 'Invalid Request',
        success: false,
      });
    }
  } catch (error) {
    return res.json(500, {
      message: 'Internal Server Error',
    });
  }
};
