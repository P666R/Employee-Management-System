import asyncHandler from 'express-async-handler';
import Employee from '../../models/employeeModel.js';
import validateQueryParams from '../../middleware/validateQueryParamsMiddleware.js';

const getAllEmployees = asyncHandler(async (req, res) => {
  validateQueryParams(req, res);

  const { search, page = 1, limit = 5, sortBy } = req.query;

  const filters = {};
  if (search) {
    filters.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { mobile: { $regex: search, $options: 'i' } },
    ];
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
    .limit(limit);

  res.status(200).json({
    success: true,
    count: employees.length,
    employees,
  });
});

export default getAllEmployees;
