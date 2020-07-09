import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import renderHTML from 'react-render-html';

import { getComments } from '../redux/category';
import RichTextEditor from './RichTextEditor';
import './styles/Comments.css';

const Comments = props => {
    const { categoryId, getComments, threadId } = props;

    useEffect(() => {
        getComments(categoryId, threadId);
    }, [categoryId, getComments, threadId]);

    const commentsObj = props.categories[`category_${categoryId}`].threads[`thread_${threadId}`].comments;

    const deletePost = async (e) => {
        e.preventDefault();
        // const token = props.token;
        // const { comment_id, thread_id } = currentComment;
        // const deleteRes = await fetch(`${apiBaseUrl}/delete-comment`, {
        //     method: 'DELETE',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${token}`
        //     },
        //     body: JSON.stringify({ category_id, thread_id }),
        // })

        // if (deleteRes.ok) {
        //     const { redirectUrl } = await deleteRes.json();
        //     history.push(redirectUrl);
        // }
    }

    const toggleEdit = (e) => {
        if (e) e.preventDefault();
        const editBox = document.querySelector('.comment-content-edit');
        const content = document.querySelector('.comment-content');
        const editThread = document.querySelector('.comment-edit-btn');
        const submitBtn = document.querySelector('.comment-edit-submit-btn');
        const deleteThread = document.querySelector('.comment-delete-btn');

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
                        {Object.keys(commentsObj).map(comment => {
                            const currentComment = commentsObj[comment];
                            return (
                                <div key={comment} className='comment-container'>
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
                                        <div className='comment-content'>
                                            {renderHTML(currentComment.content)}
                                        </div>
                                        <form className='comment-content-form'>

                                            {props.account ? (<>
                                                {
                                                    currentComment.commentOwner.user_id === props.account.userId ? (
                                                        <>
                                                            <div className='comment-content-edit' style={{ display: 'none' }}>
                                                                <RichTextEditor content={currentComment.content} />
                                                            </div>
                                                            <div className='comment-user-actions'>
                                                                <button className='comment-edit-btn' onClick={toggleEdit}>
                                                                    Edit Comment
                                                        </button>
                                                                <button className='comment-edit-submit-btn' onClick={submitEdit} style={{ display: 'none' }} >
                                                                    Submit
                                                        </button>
                                                                <button className='comment-delete-btn' onClick={deletePost}>
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
        content: state.createThread.textContent,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        getComments: (...args) => dispatch(getComments(...args)),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    Comments
);