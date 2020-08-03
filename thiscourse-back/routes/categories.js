const express = require('express');
const db = require('../db/models');
const { asyncHandler } = require('../utils');

const router = express.Router();
const { Category, Thread } = db;

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

module.exports = router;