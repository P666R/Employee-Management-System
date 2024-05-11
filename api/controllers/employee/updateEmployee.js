import asyncHandler from 'express-async-handler';
import Employee from '../../models/employeeModel.js';

const updateEmployee = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, mobile, designation, gender, course, image } = req.body;

  const employee = await Employee.findById(id).lean();

  if (!employee) {
    res.status(404);
    throw new Error('Employee not found');
  }

  const updatedFields = {
    name: name || employee.name,
    email: email || employee.email,
    mobile: mobile || employee.mobile,
    designation: designation || employee.designation,
    gender: gender || employee.gender,
    course: course || employee.course,
    image: image || employee.image,
  };

  const filteredFields = Object.keys(updatedFields).reduce((acc, key) => {
    if (updatedFields[key] !== employee[key]) {
      acc[key] = updatedFields[key];
    }
    return acc;
  }, {});

  if (Object.keys(filteredFields).length > 0) {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { $set: filteredFields },
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      success: true,
      employee: updatedEmployee,
    });

    return;
  }

  res.status(200).json({
    success: true,
    message: 'No fields to update',
  });
});

export default updateEmployee;
