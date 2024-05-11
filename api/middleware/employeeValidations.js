import { query, param } from 'express-validator';
import validator from 'validator';

export const getAllEmployeesValidations = () => [
  query('search')
    .optional()
    .custom((value, { req }) => {
      if (validator.isEmail(value)) {
        req.query.searchType = 'email';
      } else if (validator.isMobilePhone(value, 'en-IN')) {
        req.query.searchType = 'mobile';
      } else if (validator.isLength(value, { min: 3 })) {
        req.query.searchType = 'name';
      } else {
        throw new Error(
          'Search query must be a valid email, mobile number, or string of at least 3 characters',
        );
      }
      return true;
    })
    .trim()
    .escape(),
  query('page').optional().isInt(),
  query('limit').optional().isInt(),
  query('sortBy').optional().isString().trim().escape(),
];

export const getEmployeeValidations = () => [
  param('id').isMongoId().withMessage('Invalid employee ID'),
];

export const updateEmployeeValidations = () => [
  param('id').isMongoId().withMessage('Invalid employee ID'),
];

export const deleteEmployeeValidations = () => [
  param('id').isMongoId().withMessage('Invalid employee ID'),
];
