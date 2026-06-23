const express = require('express');
const { body } = require('express-validator');
const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const employeeValidationRules = [
  body('fullName').trim().isLength({ min: 2 }).withMessage('Full name must be at least 2 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('mobileNumber').matches(/^[0-9]{10}$/).withMessage('Mobile number must be exactly 10 digits'),
  body('department').notEmpty().withMessage('Department is required'),
  body('designation').trim().notEmpty().withMessage('Designation is required'),
  body('joiningDate').isISO8601().withMessage('Joining date must be a valid date'),
];

// All employee routes require authentication
router.use(protect);

router.route('/').get(getEmployees).post(employeeValidationRules, createEmployee);

router
  .route('/:id')
  .get(getEmployeeById)
  .put(employeeValidationRules, updateEmployee)
  .delete(deleteEmployee);

module.exports = router;
