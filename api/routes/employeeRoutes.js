import express from 'express';

import checkAuth from '../middleware/checkAuthMiddleware.js';
import getAllEmployees from '../controllers/employee/getAllEmployees.js';
import getEmployee from '../controllers/employee/getEmployee.js';
import createEmployee from '../controllers/employee/createEmployee.js';
import updateEmployee from '../controllers/employee/updateEmployee.js';
import deleteEmployee from '../controllers/employee/deleteEmployee.js';
import role from '../middleware/roleMiddleware.js';
import {
  getEmployeeValidations,
  updateEmployeeValidations,
  deleteEmployeeValidations,
  getAllEmployeesValidations,
} from '../middleware/employeeValidations.js';

const router = express.Router();

router.use(checkAuth, role.checkRole(role.ROLES.Admin));

router
  .route('/')
  .get(getAllEmployeesValidations, getAllEmployees)
  .post(createEmployee);

router
  .route('/:id')
  .get(getEmployeeValidations, getEmployee)
  .patch(updateEmployeeValidations, updateEmployee)
  .delete(deleteEmployeeValidations, deleteEmployee);

export default router;
