import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';
import renderHTML from 'react-render-html';

import Comments from './Comments';
import ForumNav from './ForumNav';
import RichTextEditor from './RichTextEditor';
import ScrollToTop from './ScrollToTop';
import { createComment, editThread, getCategories, getThreads } from '../redux/category';
import { getThreadContent, getCommentContent } from '../redux/createThread';
import './styles/Thread.css';

const epochToDate = (epoch) => {
    const date = new Date(epoch);
    const monthsArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const month = monthsArr[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    return (`${month} ${day}, ${year}`);
}

const Thread = (props) => {
    const path = props.location.pathname;
    const categoryInfo = path.split('/')[2];
    let title = categoryInfo.split('-')[1];
    let categoryId;
    let currentThread;
    let threads;

    if (props.categories) {
        categoryId = Number.parseInt(categoryInfo.split('-')[0], 10);
        const categoryObj = props.categories[`category_${categoryId}`];
        const threads = categoryObj.threads;
        const threadTitle = decodeURI(title);

        if (threads) {
            Object.keys(threads).forEach(thread => {
                const threadObj = threads[thread];
                if (threadObj.category_id === categoryId && threadObj.title.includes(threadTitle)) {
                    currentThread = threadObj;
                    return title = threadObj.title;
                }
            })
        }
    }

    if (props.categories) {
        threads = props.categories[`category_${categoryId}`].threads;
    }

    const { getCategories, getThreads } = props;
    useEffect(() => {
        if (!props.categories) getCategories();
    }, [getCategories, props.categories])
    useEffect(() => {
        if (categoryId && !threads) getThreads(categoryId);
    }, [categoryId, getThreads, threads]);

    const deletePost = async (e) => {
        e.preventDefault();
    }

    const submitReply = () => {
        const commentData = { user_id: props.account.userId, content: props.commentContent };
        props.createComment(commentData, categoryId, currentThread.thread_id, props.token);
    }

    const toggleEdit = (e) => {
        if (e) e.preventDefault();
        const editBox = document.querySelector('.thread-content-edit');
        const content = document.querySelector('.thread-content');
        const editThread = document.querySelector('.thread-edit-btn');
        const submitBtn = document.querySelector('.thread-edit-submit-btn');
        const deleteThread = document.querySelector('.thread-delete-btn');

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
            editThread.innerHTML = 'Edit Thread';
        }
    }

    const submitEdit = (e) => {
        e.preventDefault();
        const { thread_id } = currentThread;
        props.editThread(props.content, thread_id, props.token);
        toggleEdit();
    }

    return (
        <>
            {props.categories ? (
                <>
                    <ForumNav categoryId={categoryId} title={title} />
                    <div className='thread-container'>
                        {currentThread ? (
                            <>
                                <div className='thread-left-section'>
                                    <NavLink to={`/u/${currentThread.threadOwner.display_name}`} className='thread-owner-name'>
                                        {currentThread.threadOwner.display_name}
                                    </NavLink>
                                    <div className='thread-owner-img'>
                                        <NavLink to={`/u/${currentThread.threadOwner.display_name}`} >
                                            <img src={currentThread.threadOwner.profile_img} alt='Profile Icon' />
                                        </NavLink>
                                        <NavLink to={`/u/${currentThread.threadOwner.display_name}`} className='profile-hover-text'>
                                            Go to profile
                                        </NavLink>
                                    </div>
                                    <div className='thread-create-date-container'>
                                        Creation Date:
                                        <div className='thread-create-date'>
                                            {epochToDate(currentThread.createdAt)}
                                        </div>
                                    </div>
                                </div>
                                <div className='thread-right-section'>
                                    <div className='thread-title'>{currentThread.title}</div>
                                    <div className='thread-content'>
                                        {renderHTML(currentThread.content)}
                                    </div>
                                    <form className='thread-content-form'>
                                        {props.account ? (
                                            <>
                                                {
                                                    currentThread.threadOwner.user_id === props.account.userId ? (
                                                        <div className='thread-content-edit' style={{ display: 'none' }}>
                                                            <RichTextEditor content={currentThread.content} getContent={props.getThreadContent} />
                                                        </div>
                                                    ) : <></>
                                                }
                                                <div className='thread-user-actions'>
                                                    {
                                                        currentThread.threadOwner.user_id === props.account.userId ? (
                                                            <>
                                                                <button className='thread-edit-btn' onClick={toggleEdit}>
                                                                    Edit Thread
                                                                </button>
                                                                <button className='thread-edit-submit-btn' onClick={submitEdit} style={{ display: 'none' }} >
                                                                    Submit
                                                                </button>
                                                                <button className='thread-delete-btn' onClick={deletePost}>
                                                                    Delete Thread
                                                                </button>
                                                            </>
                                                        ) : <></>
                                                    }
                                                </div>
                                            </>) : <></>
                                        }
                                    </form>

                                </div>
                            </>

                        ) : <h1>Loading</h1>}
                    </div>
                </>
            ) : <h1>Loading</h1>}
            <div className='thread-reply-box'>
                <div className='thread-container'>
                    <>
                        <div className='thread-left-section'></div>
                        <div className='thread-right-section'>
                            <div className='thread-title'>Reply</div>
                            <div className='thread-content'>
                                <RichTextEditor account={props.account} getContent={props.getCommentContent} submit={submitReply} />
                            </div>
                        </div>
                    </>
                </div>
            </div>
            {currentThread && categoryId ?
                <Comments
                    threadId={currentThread.thread_id}
                    categoryId={categoryId}
                    epochToDate={epochToDate}
                /> : <h1>Loading</h1>
            }
            <ScrollToTop />
        </>
    )
}

const mapStateToProps = state => {
    if (state.user.session && state.user.account) {
        return {
            account: state.user.account,
            categories: state.category.categories,
            content: state.createThread.threadContent,
            commentContent: state.createThread.commentContent,
            token: state.user.session.token,
        };
    }
    return {
        categories: state.category.categories,
        content: state.createThread.textContent,
        commentContent: state.createThread.commentContent,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        createComment: (...args) => dispatch(createComment(...args)),
        editThread: (...args) => dispatch(editThread(...args)),
        getCategories: () => dispatch(getCategories()),
        getThreads: (...args) => dispatch(getThreads(...args)),
        getThreadContent: (...args) => dispatch(getThreadContent(...args)),
        getCommentContent: (...args) => dispatch(getCommentContent(...args)),
    }
};

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(
    Thread
));