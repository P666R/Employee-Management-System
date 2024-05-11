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
import validateQueryParams from '../middleware/validateQueryParamsMiddleware.js';

const router = express.Router();

router.use(checkAuth, role.checkRole(role.ROLES.Admin));

router
  .route('/')
  .get(getAllEmployeesValidations(), validateQueryParams, getAllEmployees)
  .post(createEmployee);

router
  .route('/:id')
  .get(getEmployeeValidations(), validateQueryParams, getEmployee)
  .patch(updateEmployeeValidations(), validateQueryParams, updateEmployee)
  .delete(deleteEmployeeValidations(), validateQueryParams, deleteEmployee);

export default router;
