import { validationResult } from 'express-validator';

const allowedParams = ['search', 'page', 'limit', 'sortBy', 'searchType'];

const validateQueryParams = (req, res, next) => {
  const unexpectedParams = Object.keys(req.query).filter(
    (param) => !allowedParams.includes(param),
  );

  if (unexpectedParams.length > 0) {
    res.status(400);
    throw new Error(
      `Unexpected query parameters: ${unexpectedParams.join(', ')}`,
    );
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(
      `Validation failed: ${errors
        .array()
        .map((e) => e.msg)
        .join(', ')}`,
    );
  }

  next();
};

export default validateQueryParams;
