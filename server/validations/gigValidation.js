const { body } = require('express-validator');

const gigValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Gig title is required')
    .isLength({ min: 10, max: 100 })
    .withMessage('Title must be between 10 and 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Gig description is required')
    .isLength({ min: 20 })
    .withMessage('Description must be at least 20 characters long'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),
  body('packages')
    .isArray({ min: 1 })
    .withMessage('At least one package pricing tiers must be provided'),
  body('packages.*.name')
    .trim()
    .notEmpty()
    .withMessage('Package name is required'),
  body('packages.*.price')
    .isNumeric()
    .withMessage('Package price must be a valid number'),
  body('packages.*.deliveryDays')
    .isNumeric()
    .withMessage('Package delivery days must be a number'),
];

module.exports = { gigValidator };
