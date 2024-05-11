import asyncHandler from 'express-async-handler';
import Employee from '../../models/employeeModel.js';

const getEmployee = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const employee = await Employee.findById(id);

  if (!employee) {
    res.status(404);
    throw new Error('Employee not found');
  }

  res.status(200).json({
    success: true,
    employee,
  });
});

export default getEmployee;
