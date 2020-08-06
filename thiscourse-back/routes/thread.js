const express = require('express');

const db = require('../db/models');
const { asyncHandler } = require('../utils');
const { requireUserAuth } = require('../auth');

const router = express.Router();
const { Comment, Category, Thread, User } = db;

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
            id,
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
            thread_id: id,
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

// Get threads by user id
router.get('/threads/user/:user_id', asyncHandler(async (req, res, next) => {
    const threads = await Thread.findAll({
        where: {
            user_id: req.params.user_id,
        }
    });

    const threadReturnObj = {};
    await Promise.all(threads.map(async thread => {
        const threadData = thread.dataValues;
        const {
            id,
            category_id,
            user_id,
            title,
            content,
            is_locked,
            is_stickied,
            bump_time,
            tags,
            createdAt,
        } = threadData;

        const user = await User.findByPk(user_id);
        const { display_name, profile_img } = user;
        const createdAtEpoch = createdAt.getTime();


        return threadReturnObj[`thread_${threadData.id}`] = {
            thread_id: id,
            category_id,
            title,
            content,
            is_locked,
            is_stickied,
            bump_time,
            tags,
            createdAt: createdAtEpoch,
            threadOwner: { user_id, display_name, profile_img }
        }
    }));

    res.json(threadReturnObj);
}));

// Post a thread
router.post('/:categoryId/new-thread', requireUserAuth, asyncHandler(async (req, res, next) => {
    const { user_id, title, content, tags } = req.body;
    const category_id = req.params.categoryId;

    const tagNames = tags.map(tag => {
        const { text } = tag;
        return text;
    });

    const threadData = {
        category_id,
        user_id,
        title,
        content,
        tags: tagNames,
        is_locked: false,
        is_stickied: false,
        bump_time: null,
    };

    const thread = await Thread.create(threadData);

    res.json({
        thread_id: thread.id,
        category_id: thread.category_id,
        user_id: thread.user_id,
        title: thread.title,
        content: thread.content,
        tags: thread.tags,
        is_locked: thread.is_locked,
        is_stickied: thread.is_stickied,
        bump_time: thread.bump_time,
        createdAt: thread.createdAt,
    })
}));

// Edit a thread
router.put('/edit-thread', requireUserAuth, asyncHandler(async (req, res, next) => {
    const { content, thread_id } = req.body;
    const thread = await Thread.findByPk(thread_id);

    if (thread) {
        await thread.update({ content });
    }

    res.json({ category_id: thread.category_id, content });
}));

// Delete a thread
router.delete('/delete-thread', requireUserAuth, asyncHandler(async (req, res, next) => {
    const { category_id, thread_id } = req.body;
    const thread = await Thread.findByPk(thread_id);
    const category = await Category.findByPk(category_id);

    const { name } = category;

    if (thread) {
        thread.destroy();
    }

    res.json({ redirectUrl: `/c/${name}` })
}));

// Get comments with thread id
router.get('/comments/:thread_id', asyncHandler(async (req, res, next) => {
    const comments = await Comment.findAll({
        where: {
            thread_id: req.params.thread_id,
        }
    });

    const commentReturnObj = {};
    await Promise.all(comments.map(async (comment) => {
        const commentData = comment.dataValues;
        const { user_id, content, is_locked, createdAt, updatedAt } = commentData;

        const user = await User.findByPk(user_id);
        const { display_name, profile_img } = user;

        commentReturnObj[`comment_${commentData.id}`] = {
            comment_id: commentData.id,
            content,
            is_locked,
            createdAt,
            updatedAt,
            commentOwner: { user_id, display_name, profile_img },
        }
        return;
    }))

    res.json(commentReturnObj);
}));

// Post a comment on an existing thread that is not locked
router.post('/comments/:thread_id', requireUserAuth, asyncHandler(async (req, res, next) => {
    const { user_id, content } = req.body;
    const thread = await Thread.findByPk(req.params.thread_id);

    if (thread && !thread.is_locked) {
        const user = await User.findByPk(user_id);
        const { display_name, profile_img } = user;

        const comment = await Comment.create({
            user_id,
            thread_id: req.params.thread_id,
            content: content,
            is_locked: false,
        });

        const { is_locked, createdAt, updatedAt } = comment;
        const commentNum = comment.id;
        res.json({
            commentData: {
                comment_id: comment.id,
                content,
                is_locked,
                createdAt,
                updatedAt,
                commentOwner: { user_id, display_name, profile_img }
            },
            commentNum
        });
    }
}));

// Delete a comment
router.delete('/delete-comment', requireUserAuth, asyncHandler(async (req, res, next) => {
    const { comment_id } = req.body;
    const comment = await Comment.findByPk(comment_id);

    if (comment && (req.user.dataValues.id === comment.user_id)) {
        await comment.destroy();
        res.json({});
    }
}));

// Edit a comment
router.put('/edit-comment', requireUserAuth, asyncHandler(async (req, res, next) => {
    const { comment_id, content } = req.body;
    const comment = await Comment.findByPk(comment_id);

    if (comment && (req.user.dataValues.id === comment.user_id)) {
        const user = await User.findByPk(comment.user_id);
        const { display_name, profile_img } = user;

        comment.content = content;
        await comment.save()

        const { is_locked, createdAt, updatedAt } = comment;
        const commentNum = comment.id;
        res.json({
            commentData: {
                comment_id: comment.id,
                content,
                is_locked,
                createdAt,
                updatedAt,
                commentOwner: { user_id: comment.user_id, display_name, profile_img }
            },
            commentNum
        });
    }
}));

module.exports = router;