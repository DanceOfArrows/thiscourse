import { apiBaseUrl } from '../config';

const ADD_THREAD = 'thiscourse/Home/ADD_THREAD';
const LOAD_CATEGORIES = 'thiscourse/Home/LOAD_CATEGORIES';
const LOAD_THREADS = 'thiscourse/Home/LOAD_THREADS';
const LOAD_THREAD = 'thiscourse/Home/LOAD_THREAD';
const ADD_COMMENT = 'thiscourse/Thread/ADD_COMMENT';
const REMOVE_COMMENT = 'thiscourse/Thread/REMOVE_COMMENT';
const LOAD_COMMENTS = 'thiscourse/Comments/LOAD_COMMENTS';

export const loadCategories = (categories) => ({
    type: LOAD_CATEGORIES,
    categories,
});

export const loadThreads = (threads, categoryId) => ({
    type: LOAD_THREADS,
    categoryId,
    threads,
});

export const loadThread = (category_id, content, thread_id) => ({
    type: LOAD_THREAD,
    category_id,
    content,
    thread_id
});

export const addThread = () => ({
    type: ADD_THREAD,
});

export const addComment = (categoryId, commentData, commentNum, threadId) => ({ type: ADD_COMMENT, categoryId, commentData, commentNum, threadId });
export const removeComment = (categoryId, commentNum, threadId) => ({ type: REMOVE_COMMENT, categoryId, commentNum, threadId });
export const loadComments = (categoryId, comments, threadId) => ({
    type: LOAD_COMMENTS,
    categoryId,
    comments,
    threadId,
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

export const editThread = (newContent, thread_id, token) => async dispatch => {
    const threadEditRes = await fetch(`${apiBaseUrl}/edit-thread`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newContent, thread_id }),
    });

    if (threadEditRes.ok) {
        const { category_id, content } = await threadEditRes.json();
        dispatch(loadThread(category_id, content, thread_id))
    }
}

export const getComments = (categoryId, threadId) => async dispatch => {
    const commentsRes = await fetch(`${apiBaseUrl}/comments/${threadId}`);

    if (commentsRes.ok) {
        const comments = await commentsRes.json();

        dispatch(loadComments(categoryId, comments, threadId));
    }
};

export const createComment = (commentData, categoryId, thread_id, token) => async dispatch => {
    const addCommentRes = await fetch(`${apiBaseUrl}/comments/${thread_id}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(commentData),
    });

    if (addCommentRes.ok) {
        const commentResData = await addCommentRes.json();
        const { commentData, commentNum } = commentResData;
        dispatch(addComment(categoryId, commentData, commentNum, thread_id));
    }
}

export const deleteComment = (comment_id, token, category_id, thread_id) => async dispatch => {
    const deleteRes = await fetch(`${apiBaseUrl}/delete-comment`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ comment_id }),
    })

    if (deleteRes.ok) {
        dispatch(removeComment(category_id, comment_id, thread_id));
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
        case LOAD_THREAD: {
            return {
                ...state,
                categories: {
                    ...state.categories,
                    [`category_${action.category_id}`]: {
                        ...state.categories[`category_${action.category_id}`],
                        threads: {
                            ...state.categories[`category_${action.category_id}`].threads,
                            [`thread_${action.thread_id}`]: {
                                ...state.categories[`category_${action.category_id}`].threads[`thread_${action.thread_id}`],
                                content: action.content,
                            }
                        },
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
        case ADD_COMMENT: {
            return {
                ...state,
                categories: {
                    ...state.categories,
                    [`category_${action.categoryId}`]: {
                        ...state.categories[`category_${action.categoryId}`],
                        threads: {
                            ...state.categories[`category_${action.categoryId}`].threads,
                            [`thread_${action.threadId}`]: {
                                ...state.categories[`category_${action.categoryId}`].threads[`thread_${action.threadId}`],
                                comments: {
                                    ...state.categories[`category_${action.categoryId}`].threads[`thread_${action.threadId}`].comments,
                                    [`comment_${action.commentNum}`]: action.commentData,
                                },
                            }
                        },
                    }
                },
            }
        }
        case REMOVE_COMMENT: {
            const { [`comment_${action.commentNum}`]: omit, ...keep } = state.categories[`category_${action.categoryId}`].threads[`thread_${action.threadId}`].comments;
            return {
                ...state,
                categories: {
                    ...state.categories,
                    [`category_${action.categoryId}`]: {
                        ...state.categories[`category_${action.categoryId}`],
                        threads: {
                            ...state.categories[`category_${action.categoryId}`].threads,
                            [`thread_${action.threadId}`]: {
                                ...state.categories[`category_${action.categoryId}`].threads[`thread_${action.threadId}`],
                                comments: {
                                    ...keep,
                                },
                            }
                        },
                    }
                },
            }
        }
        case LOAD_COMMENTS: {
            return {
                ...state,
                categories: {
                    ...state.categories,
                    [`category_${action.categoryId}`]: {
                        ...state.categories[`category_${action.categoryId}`],
                        threads: {
                            ...state.categories[`category_${action.categoryId}`].threads,
                            [`thread_${action.threadId}`]: {
                                ...state.categories[`category_${action.categoryId}`].threads[`thread_${action.threadId}`],
                                comments: action.comments,
                            }
                        },
                    }
                },
            }
        }
        default: return state;
    }
};