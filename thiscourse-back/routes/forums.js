const express = require('express');

const db = require('../db/models');
const { asyncHandler } = require('../utils');

const router = express.Router();
const { Comment, Forum, Thread } = db;

// Get all forums
router.get('/forums', asyncHandler(async (req, res, next) => {
    const forums = await Forum.findAll();

    const forumReturnObj = {};
    forums.forEach(forum => {
        const forumData = forum.dataValues;
        const { name, parent_forum } = forumData;

        forumReturnObj[`forum_${forumData.id}`] = {
            name,
            parent_forum,
        }
        return;
    })

    res.json(forumReturnObj);
}));

// Get threads with forum id
router.get('/threads/:forum_id', asyncHandler(async (req, res, next) => {
    const threads = await Thread.findAll({
        where: {
            forum_id: req.params.forum_id,
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