import { apiBaseUrl } from '../config';

const LOAD_CATEGORIES = 'thiscourse/Home/LOAD_CATEGORIES';

export const loadCategories = (categories) => ({
    type: LOAD_CATEGORIES,
    categories,
});

export const getCategories = () => async dispatch => {
    const categoriesRes = await fetch(`${apiBaseUrl}/categories`);

    if (categoriesRes.ok) {
        const categories = await categoriesRes.json();
        dispatch(loadCategories(categories));
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
        default: return state;
    }
};