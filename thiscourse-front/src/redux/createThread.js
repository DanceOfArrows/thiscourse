const SAVE_CONTENT = 'thiscourse/CreateThread/SAVE_CONTENT';

export const saveContent = (textContent) => ({ type: SAVE_CONTENT, textContent });

export const getCurrentContent = (textContent) => dispatch => {
    dispatch(saveContent(textContent));
}

export default function reducer(state = {}, action) {
    switch (action.type) {
        case SAVE_CONTENT: {
            return {
                ...state,
                textContent: action.textContent,
            }
        }
        default: return state;
    }
}