const SAVE_CONTENT = 'thiscourse/CreateThread/SAVE_CONTENT';

export const saveContent = (threadContent) => ({ type: SAVE_CONTENT, threadContent });

export const getCurrentContent = (threadContent) => dispatch => {
    dispatch(saveContent(threadContent));
}

export default function reducer(state = {}, action) {
    switch (action.type) {
        case SAVE_CONTENT: {
            return {
                ...state,
                threadContent: action.threadContent,
            }
        }
        default: return state;
    }
}