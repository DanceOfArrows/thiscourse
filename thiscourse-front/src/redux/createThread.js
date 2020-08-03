const SAVE_CONTENT = 'thiscourse/CreateThread/SAVE_CONTENT';
const SAVE_THREAD_CONTENT = 'thiscourse/Thread/SAVE_THREAD_EDIT';
const SAVE_COMMENT_CONTENT = 'thiscourse/Comments/SAVE_COMMENT_EDIT';

export const saveContent = (textContent) => ({ type: SAVE_CONTENT, textContent });
export const saveThreadEdit = (textContent) => ({ type: SAVE_THREAD_CONTENT, textContent });
export const saveCommentEdit = (textContent) => ({ type: SAVE_COMMENT_CONTENT, textContent });

export const getCurrentContent = (textContent) => dispatch => {
    dispatch(saveContent(textContent));
}

export const getThreadContent = (textContent) => dispatch => {
    dispatch(saveThreadEdit(textContent));
}

export const getCommentContent = (textContent) => dispatch => {
    dispatch(saveCommentEdit(textContent));
}

export default function reducer(state = {}, action) {
    switch (action.type) {
        case SAVE_CONTENT: {
            return {
                ...state,
                textContent: action.textContent,
            }
        }
        case SAVE_THREAD_CONTENT: {
            return {
                ...state,
                threadContent: action.textContent,
            }
        }
        case SAVE_COMMENT_CONTENT: {
            return {
                ...state,
                commentContent: action.textContent,
            }
        }
        default: return state;
    }
}