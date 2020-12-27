// import express
const express = require('express');

// import express router
const router = express.Router();

// import passport to add authentication middleware
const passport = require('passport');

// import assets controller api
const assignmentApi = require('../../../controllers/api/v1/assignment_api');

// route to create assignment
router.get(
  '/create',
  passport.authenticate('jwt', { session: false }),
  assignmentApi.createAssignment
);

// route to submit assignment.
router.post(
  '/assignments/:id',
  passport.authenticate('jwt', { session: false }),
  assignmentApi.submitAssignment
);

//route to get all assignments
router.get('/all-assignments', assignmentApi.getAllAssignments);

//route to evaluate assignments
router.get(
  '/evaluate/:aid/:sid/:grade',
  passport.authenticate('jwt', { session: false }),
  assignmentApi.evaluateAssignments
);

// export the router
module.exports = router;
