import express from 'express';
import checkAuth from '../middleware/checkAuthMiddleware.js';
import {
  createEmployee,
  getAllEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
} from '../controllers/employee/employeeController.js';
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
