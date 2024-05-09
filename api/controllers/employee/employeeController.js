import asyncHandler from 'express-async-handler';
import Employee from '../../models/employeeModel.js';
import validateQueryParams from '../../middleware/validateQueryParamsMiddleware.js';

const createEmployee = asyncHandler(async (req, res) => {
  const { name, email, mobile, designation, gender, course, image } = req.body;

  const employee = new Employee({
    name,
    email,
    mobile,
    designation,
    gender,
    course,
    image,
  });

  await employee.save();

  res.status(201).json({
    success: true,
    employee,
  });
});

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

const getEmployee = asyncHandler(async (req, res) => {
  validateQueryParams(req, res);

  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    res.status(404);
    throw new Error('Employee not found');
  }

  res.status(200).json({
    success: true,
    employee,
  });
});

const updateEmployee = asyncHandler(async (req, res) => {
  validateQueryParams(req, res);

  const { id } = req.params;
  const { name, email, mobile, designation, gender, course, image } = req.body;

  const employee = await Employee.findById(id);

  if (!employee) {
    res.status(404);
    throw new Error('Employee not found');
  }

  const update = {
    $set: {
      name: name || employee.name,
      email: email || employee.email,
      mobile: mobile || employee.mobile,
      designation: designation || employee.designation,
      gender: gender || employee.gender,
      course: course || employee.course,
      image: image || employee.image,
    },
  };

  const updatedEmployee = await Employee.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    employee: updatedEmployee,
  });
});

const deleteEmployee = asyncHandler(async (req, res) => {
  validateQueryParams(req, res);

  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    res.status(404);
    throw new Error('Employee not found');
  }

  await employee.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Employee deleted successfully',
  });
});

export {
  createEmployee,
  getAllEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
};
