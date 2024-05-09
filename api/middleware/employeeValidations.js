import { query, param } from 'express-validator';

export const getAllEmployeesValidations = [
  query('search').optional().isString(),
  query('page').optional().isInt(),
  query('limit').optional().isInt(),
  query('sortBy').optional().isString(),
];

export const getEmployeeValidations = [
  param('id').isMongoId().withMessage('Invalid employee ID'),
];

export const updateEmployeeValidations = [
  param('id').isMongoId().withMessage('Invalid employee ID'),
];

export const deleteEmployeeValidations = [
  param('id').isMongoId().withMessage('Invalid employee ID'),
];
