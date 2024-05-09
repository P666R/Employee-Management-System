import { validationResult } from 'express-validator';

const validateQueryParams = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(
      `Validation failed - ${errors
        .array()
        .map((e) => e.msg)
        .join(', ')}`,
    );
  }
};

export default validateQueryParams;
