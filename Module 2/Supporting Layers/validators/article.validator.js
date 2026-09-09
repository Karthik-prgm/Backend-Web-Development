const { body } = require('express-validator');

const createArticle = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required'),

  body('body')
    .trim()
    .notEmpty()
    .withMessage('Body is required'),
];

const updateArticle = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty'),

  body('body')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Body cannot be empty'),
];

module.exports = {
  createArticle,
  updateArticle,
};