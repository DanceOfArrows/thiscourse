import { apiBaseUrl } from '../config';

const LOAD_CATEGORIES = 'thiscourse/Home/LOAD_CATEGORIES';
const LOAD_THREADS = 'thiscourse/Home/LOAD_THREADS';

export const loadCategories = (categories) => ({
    type: LOAD_CATEGORIES,
    categories,
});

export const loadThreads = (threads) => ({
    type: LOAD_THREADS,
    threads,
});

export const getCategories = () => async dispatch => {
    const categoriesRes = await fetch(`${apiBaseUrl}/categories`);

    if (categoriesRes.ok) {
        const categories = await categoriesRes.json();
        let sortedCategories = [];
        let sortedCategoriesObj = {};
        Object.keys(categories).forEach(category => {
            sortedCategories.push({ [category]: categories[category] })
        });

        sortedCategories.sort(function (a, b) {
            var nameA = a[Object.keys(a)].name;
            var nameB = b[Object.keys(b)].name;
            return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
        });

        sortedCategories.forEach(categoryObj => {
            const categoryName = Object.keys(categoryObj);

            sortedCategoriesObj[categoryName] = categoryObj[categoryName];
        });

        dispatch(loadCategories(sortedCategoriesObj));
    }
};

export const getThreads = (categoryId) => async dispatch => {
    const categoriesRes = await fetch(`${apiBaseUrl}/threads/${categoryId}`);

    if (categoriesRes.ok) {
        const threads = await categoriesRes.json();

        dispatch(loadThreads(threads));
    }
};

export default function reducer(state = {}, action) {
    switch (action.type) {
        case LOAD_CATEGORIES: {
            return {
                ...state,
                categories: action.categories,
            };
        }
        case LOAD_THREADS: {
            return {
                ...state,
                threads: action.threads,
            }
        }
        default: return state;
    }
};