import asyncHandler from 'express-async-handler';
import Employee from '../../models/employeeModel.js';

const getAllEmployees = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 5, sortBy, searchType } = req.query;

  const filters = {};
  if (search && searchType) {
    filters[searchType] = { $regex: search, $options: 'i' };
  }

  let sortOptions = {};
  if (sortBy) {
    const sortFields = sortBy.split(',').map((field) => {
      const order = field.startsWith('-') ? -1 : 1;
      const sortField = field.replace(/^-/, '');
      return [sortField, order];
    });
    sortOptions = Object.fromEntries(sortFields);
  }

  const skip = (page - 1) * limit;

  const employees = await Employee.find(filters)
    .sort(sortOptions)
    .skip(skip)
    .limit(limit)
    .lean();

  res.status(200).json({
    success: true,
    count: employees.length,
    employees,
  });
});

export default getAllEmployees;
