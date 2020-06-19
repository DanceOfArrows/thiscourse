const bcrypt = require('bcryptjs');
const express = require('express');
const { check } = require('express-validator');
const { Op } = require("sequelize");

const { getUserToken, requireUserAuth, validatePassword } = require('../auth')
const { cloudinaryConfig, uploader } = require('../config/cloudinary')
const { asyncHandler, dataUri, handleValidationErrors, multerUploads } = require('../utils');
const db = require('../db/models');

const router = express.Router();
const { User, UserToRole } = db;

const userValidators = [
  check('username')
    .exists({ checkFalsy: true })
    .withMessage('Please enter a username')
    .isLength({ max: 32 })
    .withMessage('Username must not be more than 32 characters long'),
  check('display_name')
    .exists({ checkFalsy: true })
    .withMessage('Please enter a display name')
    .isLength({ max: 32 })
    .withMessage('Display name must not be more than 32 characters long'),
  check('email')
    .exists({ checkFalsy: true })
    .withMessage('Please provide an email')
    .isLength({ max: 255 })
    .withMessage('Email address must not be more than 255 characters long')
    .isEmail()
    .withMessage('Email address is not a valid email'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please enter a password')
    .isLength({ max: 32 })
    .withMessage('Password must not be more than 32 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, 'g')
    .withMessage('Password must contain at least 1 lowercase letter, uppercase letter, number, and special character (i.e. "!@#$%^&*")'),
];

const userNotFound = userId => {
  const err = new Error("User not found");
  err.errors = [`User with id: ${userId} could not be found.`];
  err.title = "User not found.";
  err.status = 404;
  return err;
}


// Registration
router.post('/register',
  userValidators,
  handleValidationErrors,
  asyncHandler(async (req, res, next) => {
    const { username, email, display_name, password } = req.body;
    const profile_img = 'https://res.cloudinary.com/lullofthesea/image/upload/v1592425468/Thiscourse/smc58cote4vfnokjtgs7.png';
    const hashed_password = await bcrypt.hash(password, 10);

    const user = await User.create({ username, email, display_name, hashed_password, profile_img })
    await UserToRole.create({ user_id: user.id, role_id: 1 })

    const token = getUserToken(user);

    res
      .status(201)
      .json({
        userId: user.id,
        email: user.email,
        display_name: user.display_name,
        bio: user.bio,
        profile_img: user.profile_img,
        token,
      })
  }));

// Login
router.post('/login', asyncHandler(async (req, res, next) => {
  const { usernameEmail, password } = req.body;
  let user;

  if (usernameEmail) {
    user = await User.findOne({
      where: {
        [Op.or]: [
          { username: usernameEmail },
          { email: usernameEmail },
        ]
      }
    });
  }

  if (!user || !validatePassword(password, user.hashed_password)) {
    const err = new Error('Failed to log in.');
    err.errors = ['The provided credentials were invalid'];
    err.status = 401;
    err.title = 'Login failed.';
    return next(err);
  }

  const token = getUserToken(user);

  res.json({
    userId: user.id,
    email: user.email,
    display_name: user.display_name,
    bio: user.bio,
    profile_img: user.profile_img,
    token,
  });
}));

// Change profile image
router.put(
  '/profileImg',
  cloudinaryConfig,
  requireUserAuth,
  multerUploads,
  asyncHandler(async (req, res, next) => {
    if (req.file) {
      if (req.file.size > 1000000) {
        const err = new Error('Large file size.');
        err.errors = ['Max image file size is 1MB'];
        err.status = 400;
        err.title = 'Upload failed.';
        return next(err);
      };

      const file = dataUri(req).content;

      const user = await User.findOne({
        where: { id: req.user.id }
      });

      if (!user) next(userNotFound(req.params.id));

      const uploadImage = await uploader.upload(file,
        {
          transformation: [
            { width: 128, height: 128, crop: 'fill' }
          ],
          folder: 'Thiscourse'
        }, function (error, result) {
          if (error) {
            return next(error);
          }
        });
      const profile_img = uploadImage.secure_url

      await user.update({
        profile_img,
      });

      res.json({ profile_img });
    }
  }));

// Get User
router.get('/:id',
  asyncHandler(async (req, res, next) => {
    const user = await User.findByPk(req.params.id)

    if (!user) next(userNotFound(req.params.id));

    res.json({
      userId: user.id,
      display_name: user.display_name,
      bio: user.bio,
      profile_img: user.profile_img,
    });
  }));

// Edit User
router.put('/:id',
  requireUserAuth,
  userValidators.slice(1, 4),
  asyncHandler(async (req, res, next) => {
    const user = await User.findOne({
      where: { id: req.params.id }
    })

    if (!user) next(userNotFound(req.params.id));

    if (req.body.password) {
      const password = req.body.password.new;
      const oldPassword = req.body.password.old;

      if (!validatePassword(oldPassword, user.hashed_password)) {
        const err = new Error('Old password is incorrect.');
        err.errors = ['Old password did not match.'];
        err.status = 401;
        err.title = 'Incorrect password.';
        return next(err);
      }

      const hashed_password = await bcrypt.hash(password, 10);
      await user.update({ hashed_password });
    }

    const validArgs = ['email', 'display_name', 'bio']
    for (const arg in req.body) {
      if (!arg || !validArgs.includes(arg)) continue;

      await user.update({ [arg]: req.body[arg] })
    }

    res.json({
      userId: user.id,
      email: user.email,
      display_name: user.display_name,
      bio: user.bio,
      profile_img: user.profile_img,
    });
  }));

module.exports = router;

