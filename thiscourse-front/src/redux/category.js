import { apiBaseUrl } from '../config';

const ADD_THREAD = 'thiscourse/Home/ADD_THREAD';
const LOAD_CATEGORIES = 'thiscourse/Home/LOAD_CATEGORIES';
const LOAD_THREADS = 'thiscourse/Home/LOAD_THREADS';

export const loadCategories = (categories) => ({
    type: LOAD_CATEGORIES,
    categories,
});

export const loadThreads = (threads, categoryId) => ({
    type: LOAD_THREADS,
    categoryId,
    threads,
});

export const addThread = () => ({
    type: ADD_THREAD,
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

        dispatch(loadCategories(sortedCategoriesObj, false));
    }
};

export const getThreads = (categoryId) => async dispatch => {
    const categoriesRes = await fetch(`${apiBaseUrl}/threads/${categoryId}`);

    if (categoriesRes.ok) {
        const threads = await categoriesRes.json();

        dispatch(loadThreads(threads, categoryId));
    }
};

export const createThread = (threadData, category_id, token) => async dispatch => {
    const threadCreateRes = await fetch(`${apiBaseUrl}/${category_id}/new-thread`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(threadData),
    });

    if (threadCreateRes.ok) {
        dispatch(addThread())
    }
}

export default function reducer(state = {}, action) {
    switch (action.type) {
        case LOAD_CATEGORIES: {
            return {
                ...state,
                categories: action.categories,
                redirect: false,
            };
        }
        case LOAD_THREADS: {
            return {
                ...state,
                categories: {
                    ...state.categories,
                    [`category_${action.categoryId}`]: {
                        ...state.categories[`category_${action.categoryId}`],
                        threads: action.threads,
                    }
                },
            }
        }
        case ADD_THREAD: {
            return {
                ...state,
                redirect: true,
            }
        }
        default: return state;
    }
};