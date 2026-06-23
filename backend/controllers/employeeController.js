const { validationResult } = require('express-validator');
const Employee = require('../models/Employee');

/**
 * @desc    Get employees with search, filter, sort & pagination
 * @route   GET /api/employees
 * @access  Private
 * Query params:
 *   search    - matches against fullName (case-insensitive partial match)
 *   department- exact match filter
 *   sortBy    - field to sort by (default: createdAt)
 *   order     - 'asc' | 'desc' (default: desc)
 *   page      - page number (default: 1)
 *   limit     - page size (default: 10)
 */
const getEmployees = async (req, res, next) => {
  try {
    const {
      search = '',
      department,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    if (search.trim()) {
      query.fullName = { $regex: search.trim(), $options: 'i' };
    }

    if (department) {
      query.department = department;
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
    const skip = (pageNum - 1) * limitNum;

    const allowedSortFields = ['fullName', 'department', 'designation', 'joiningDate', 'createdAt'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortOrder = order === 'asc' ? 1 : -1;

    const [employees, total] = await Promise.all([
      Employee.find(query)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limitNum),
      Employee.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      data: employees,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single employee by id
 * @route   GET /api/employees/:id
 * @access  Private
 */
const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    return res.status(200).json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new employee
 * @route   POST /api/employees
 * @access  Private
 */
const createEmployee = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { fullName, email, mobileNumber, department, designation, joiningDate } = req.body;

    const employee = await Employee.create({
      fullName,
      email,
      mobileNumber,
      department,
      designation,
      joiningDate,
      createdBy: req.user._id,
    });

    return res.status(201).json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an employee
 * @route   PUT /api/employees/:id
 * @access  Private
 */
const updateEmployee = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    const fields = ['fullName', 'email', 'mobileNumber', 'department', 'designation', 'joiningDate'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        employee[field] = req.body[field];
      }
    });

    const updated = await employee.save();
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an employee
 * @route   DELETE /api/employees/:id
 * @access  Private
 */
const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    await employee.deleteOne();
    return res.status(200).json({ success: true, message: 'Employee deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
