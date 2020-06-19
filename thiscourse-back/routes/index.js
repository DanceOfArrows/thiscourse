const express = require('express');
const { asyncHandler } = require('../utils')

const router = express.Router();

/* GET home page. */
router.get('/', asyncHandler(async (req, res, next) => {
  res.json('Server is running...')
}))

module.exports = router;
