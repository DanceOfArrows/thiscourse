const DatauriParser = require('datauri/parser')
const multer = require('multer');
const path = require('path')
const { validationResult } = require("express-validator");

const asyncHandler = handler => (req, res, next) => handler(req, res, next).catch(next);

const handleValidationErrors = (req, res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const errors = validationErrors.array().map((error) => error.msg);

        const err = Error("Bad request.");
        err.status = 400;
        err.title = "Bad request.";
        err.errors = errors;
        return next(err);
    }
    next();
};

const storage = multer.memoryStorage(); // save file to memory
const multerUploads = multer({
    storage, fileFilter: function (req, file, next) { // Filter file types
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            const err = Error("Invalid type.");
            err.status = 400;
            err.errors = ['Only JPG/JPEG/PNG/GIF files are allowed.'];
            err.title = 'Failed to upload.'
            return next(err);
        }
        next(null, true);
    }
}).single('image');

const dUri = new DatauriParser();
const dataUri = req => dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);

module.exports = {
    asyncHandler,
    dataUri,
    handleValidationErrors,
    multerUploads,
};