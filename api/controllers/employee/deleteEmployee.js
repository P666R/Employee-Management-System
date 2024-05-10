import asyncHandler from 'express-async-handler';
import Employee from '../../models/employeeModel.js';
import validateQueryParams from '../../middleware/validateQueryParamsMiddleware.js';

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

export default deleteEmployee;
