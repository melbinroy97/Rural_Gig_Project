const { body } = require('express-validator');

const jobValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Job title is required')
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Job description is required'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),
  body('budget.type')
    .isIn(['fixed', 'hourly'])
    .withMessage('Budget type must be fixed or hourly'),
  body('budget.min')
    .optional()
    .isNumeric()
    .withMessage('Min budget must be a number'),
  body('budget.max')
    .optional()
    .isNumeric()
    .withMessage('Max budget must be a number'),
];

module.exports = { jobValidator };
