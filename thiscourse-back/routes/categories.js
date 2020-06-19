const express = require('express');

const db = require('../db/models');
const { asyncHandler } = require('../utils');

const router = express.Router();
const { Comment, Category, Thread } = db;

// Get all categories
router.get('/categories', asyncHandler(async (req, res, next) => {
    const categories = await Category.findAll({
        where: {
            parent_category: null,
        }
    });

    const categoryReturnObj = {};
    categories.forEach(category => {
        const categoryData = category.dataValues;
        const { name, description, parent_category } = categoryData;

        categoryReturnObj[`category_${categoryData.id}`] = {
            name,
            description,
            parent_category,
        }
        return;
    })

    res.json(categoryReturnObj);
}));

// Get sub-category from parent_category
router.get('/categories/:parent_categoryId', asyncHandler(async (req, res, next) => {
    const categories = await Category.findAll({
        where: {
            parent_category: req.params.parent_categoryId,
        }
    });

    const categoryReturnObj = {};
    categories.forEach(category => {
        const categoryData = category.dataValues;
        const { name, description, parent_category } = categoryData;

        categoryReturnObj[`category_${categoryData.id}`] = {
            name,
            description,
            parent_category,
        }
        return;
    })

    res.json(categoryReturnObj);
}));

// Get threads with category id
router.get('/threads/:category_id', asyncHandler(async (req, res, next) => {
    const threads = await Thread.findAll({
        where: {
            category_id: req.params.category_id,
        }
    });

    const threadReturnObj = {};
    threads.forEach(thread => {
        const threadData = thread.dataValues;
        const {
            user_id,
            title,
            content,
            is_locked,
            is_stickied,
            bump_time,
            tags,
            createdAt,
            updatedAt } = threadData;

        threadReturnObj[`thread_${threadData.id}`] = {
            user_id,
            title,
            content,
            is_locked,
            is_stickied,
            bump_time,
            tags,
            createdAt,
            updatedAt
        }
        return;
    })

    res.json(threadReturnObj);
}));

// Get comments with thread id
router.get('/comments/:thread_id', asyncHandler(async (req, res, next) => {
    const comments = await Comment.findAll({
        where: {
            thread_id: req.params.thread_id,
        }
    });

    const commentReturnObj = {};
    comments.forEach(comment => {
        const commentData = comment.dataValues;
        const { user_id, content, is_locked, createdAt, updatedAt } = commentData;

        commentReturnObj[`comment_${commentData.id}`] = {
            user_id,
            content,
            is_locked,
            createdAt,
            updatedAt
        }
        return;
    })

    res.json(commentReturnObj);
}));



module.exports = router;