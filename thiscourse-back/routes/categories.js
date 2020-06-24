const express = require('express');

const db = require('../db/models');
const { asyncHandler } = require('../utils');

const router = express.Router();
const { Comment, Category, Thread, User } = db;

// Get all categories
router.get('/categories', asyncHandler(async (req, res, next) => {
    const categories = await Category.findAll({
        order: [
            ['name', 'ASC'],
        ],
    });

    const categoryReturnObj = {};
    await Promise.all(categories.map(async category => {
        const categoryData = category.dataValues;
        let category_img;
        if (categoryData.category_img) category_img = categoryData.category_img;
        const { name, description, parent_category } = categoryData;

        const threads = await Thread.findAll({
            where: {
                category_id: categoryData.id,
            }
        })
        const thread_count = threads.length;

        const categories = await Category.findAll({
            where: {
                parent_category: categoryData.id,
            },
            order: [
                ['name', 'ASC'],
            ],
        });

        const subCategories = [];
        categories.forEach(category => {
            const categoryData = category.dataValues;

            subCategories.push(`category_${categoryData.id}`);
            return;
        })

        categoryReturnObj[`category_${categoryData.id}`] = {
            name,
            category_img,
            description,
            thread_count: thread_count,
            parent_category,
            subCategories
        }

        return;
    }));

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
    await Promise.all(threads.map(async thread => {
        const threadData = thread.dataValues;
        const {
            category_id,
            user_id,
            title,
            content,
            is_locked,
            is_stickied,
            bump_time,
            tags,
            createdAt,
            updatedAt
        } = threadData;

        const user = await User.findByPk(user_id);
        const { display_name, profile_img } = user;

        const createdAtEpoch = createdAt.getTime();
        // const updatedAtEpoch = updatedAt.getTime();

        return threadReturnObj[`thread_${threadData.id}`] = {
            category_id,
            title,
            content,
            is_locked,
            is_stickied,
            bump_time,
            tags,
            createdAt: createdAtEpoch,
            // updatedAt: updatedAtEpoch,
            threadOwner: { user_id, display_name, profile_img }
        }


    }));

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