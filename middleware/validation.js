const { body, validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const registerValidation = [
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  validateRequest,
];

const loginValidation = [
    body('login').notEmpty().withMessage('Email or username is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validateRequest,
];

const forgotPasswordValidation = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    validateRequest,
];

const resetPasswordValidation = [
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    validateRequest,
];

const createNoteValidation = [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    validateRequest,
];

const shareNoteValidation = [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('access').isIn(['read', 'write']).withMessage('Invalid access level'),
    validateRequest,
];

const feedbackValidation = [
    body('subject').notEmpty().withMessage('Subject is required'),
    body('message').notEmpty().withMessage('Message is required'),
    validateRequest,
];

const ratingValidation = [
    body('value').isInt({ min: 1, max: 5 }).withMessage('Rating must be a number between 1 and 5'),
    validateRequest,
];

const updateUserRoleValidation = [
    body('role').isIn(['admin', 'user']).withMessage('Invalid role'),
    validateRequest,
];

const updateNoteStatusValidation = [
    body('status').isIn(['approved', 'rejected', 'pending']).withMessage('Invalid status'),
    validateRequest,
];

const addCommentValidation = [
    body('text').notEmpty().withMessage('Comment text is required'),
    validateRequest,
];

const updateNoteValidation = [
    body('title').optional().isString().isLength({ min: 1, max: 100 }).withMessage('Title must be a string between 1 and 100 characters'),
    body('description').optional().isString().isLength({ min: 1, max: 2000 }).withMessage('Description must be a string between 1 and 2000 characters'),
    validateRequest,
];

module.exports = {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  createNoteValidation,
  shareNoteValidation,
  feedbackValidation,
  ratingValidation,
  updateUserRoleValidation,
  updateNoteStatusValidation,
  addCommentValidation,
  updateNoteValidation,
};
