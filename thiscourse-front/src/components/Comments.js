import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import renderHTML from 'react-render-html';

import { deleteComment, getComments } from '../redux/category';
import { getCommentContent } from '../redux/createThread';
import RichTextEditor from './RichTextEditor';
import './styles/Comments.css';

const Comments = props => {
    const { categoryId, getComments, threadId } = props;
    const commentsObj = props.categories[`category_${categoryId}`].threads[`thread_${threadId}`].comments;

    useEffect(() => {
        getComments(categoryId, threadId);
    }, [categoryId, getComments, threadId]);

    const deletePost = async (e) => {
        e.preventDefault();
        const commentId = Number.parseInt(e.target.value, 10);
        props.deleteComment(commentId, props.token, categoryId, threadId);
    }

    const toggleEdit = (e) => {
        if (e) e.preventDefault();
        const idx = Number.parseInt(e.target.value, 10);
        const editBox = document.querySelector(`.comment-${idx}-edit`);
        const content = document.querySelector(`.comment-${idx}-content`);
        const editThread = document.querySelector(`.comment-${idx}-edit-btn`);
        const submitBtn = document.querySelector(`.comment-${idx}-edit-submit-btn`);
        const deleteThread = document.querySelector(`.comment-${idx}-delete-btn`);

        if (editBox.style.display === 'none') {
            editBox.style.display = 'block';
            content.style.display = 'none';
            deleteThread.style.display = 'none';
            submitBtn.style.display = 'block';
            editThread.innerHTML = 'Cancel';
        } else {
            editBox.style.display = 'none';
            content.style.display = 'block';
            deleteThread.style.display = 'block';
            submitBtn.style.display = 'none';
            editThread.innerHTML = 'Edit Comment';
        }
    }

    const submitEdit = (e) => {
        e.preventDefault();
    }

    return (
        <>
            <div className='comments-container'>
                {props.categories && commentsObj ? (
                    <>
                        {Object.keys(commentsObj).map((comment, idx) => {
                            const currentComment = commentsObj[comment];
                            if (currentComment) {
                                const commentNum = currentComment.comment_id;
                                return (
                                    <div key={comment} className={`comment-container comment-${commentNum}`}>
                                        <div className='comment-left-section'>
                                            <NavLink to={`/u/${currentComment.commentOwner.display_name}`} className='comment-owner-name'>
                                                {currentComment.commentOwner.display_name}
                                            </NavLink>
                                            <div className='comment-owner-img'>
                                                <NavLink to={`/u/${currentComment.commentOwner.display_name}`} >
                                                    <img src={currentComment.commentOwner.profile_img} alt='Profile Icon' />
                                                </NavLink>
                                                <NavLink to={`/u/${currentComment.commentOwner.display_name}`} className='profile-hover-text'>
                                                    Go to profile
                                            </NavLink>
                                            </div>
                                            <div className='comment-create-date-container'>
                                                Comment Date:
                                            <div className='comment-create-date'>
                                                    {props.epochToDate(currentComment.createdAt)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className='comment-right-section'>
                                            <div className={`comment-content comment-${commentNum}-content`}>
                                                {renderHTML(currentComment.content)}
                                            </div>
                                            <form className='comment-content-form'>

                                                {props.account ? (<>
                                                    {
                                                        currentComment.commentOwner.user_id === props.account.userId ? (
                                                            <>
                                                                <div className={`comment-content-edit comment-${commentNum}-edit`} style={{ display: 'none' }}>
                                                                    <RichTextEditor content={currentComment.content} getContent={props.getCommentContent} />
                                                                </div>
                                                                <div className='comment-user-actions'>
                                                                    <button className={`comment-edit-btn comment-${commentNum}-edit-btn`} value={commentNum} onClick={toggleEdit}>
                                                                        Edit Comment
                                                            </button>
                                                                    <button className={`comment-edit-submit-btn comment-${commentNum}-edit-submit-btn`} value={commentNum} onClick={submitEdit} style={{ display: 'none' }} >
                                                                        Submit
                                                            </button>
                                                                    <button className={`comment-delete-btn comment-${commentNum}-delete-btn`} value={commentNum} onClick={deletePost}>
                                                                        Delete Comment
                                                            </button>
                                                                </div>
                                                            </>
                                                        ) : <></>
                                                    }
                                                </>) : <></>
                                                }
                                            </form>

                                        </div>
                                    </div>
                                )
                            }


                        })}
                    </>) : <h1>Loading</h1>}
            </div>
        </>
    )
}

const mapStateToProps = state => {
    if (state.user.session && state.user.account) {
        return {
            account: state.user.account,
            categories: state.category.categories,
            content: state.createThread.textContent,
            token: state.user.session.token,
        };
    }
    return {
        categories: state.category.categories,
        commentContent: state.createThread.commentContent,
        content: state.createThread.textContent,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        deleteComment: (...args) => dispatch(deleteComment(...args)),
        getComments: (...args) => dispatch(getComments(...args)),
        getCommentContent: (...args) => dispatch(getCommentContent(...args)),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    Comments
);