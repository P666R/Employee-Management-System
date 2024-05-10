import asyncHandler from 'express-async-handler';
import Employee from '../../models/employeeModel.js';

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

export default createEmployee;
