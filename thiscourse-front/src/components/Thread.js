import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { NavLink, useHistory } from 'react-router-dom';
import renderHTML from 'react-render-html';

import ForumNav from './ForumNav';
import RichTextEditor from './RichTextEditor';
import ScrollToTop from './ScrollToTop';
import { editThread, getCategories, getThreads } from '../redux/category';
import { apiBaseUrl } from '../config';
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

    const { getCategories, getThreads } = props;
    useEffect(() => {
        if (!props.categories) getCategories();
    }, [getCategories, props.categories])
    useEffect(() => {
        if (categoryId) getThreads(categoryId);
    }, [categoryId, getThreads]);

    let history = useHistory();

    const deletePost = async (e) => {
        e.preventDefault();
        const token = props.token;
        const { category_id, thread_id } = currentThread;
        const deleteRes = await fetch(`${apiBaseUrl}/delete-thread`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ category_id, thread_id }),
        })

        if (deleteRes.ok) {
            const { redirectUrl } = await deleteRes.json();
            history.push(redirectUrl);
        }
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

                                        {props.account ? (<>
                                            {
                                                currentThread.threadOwner.user_id === props.account.userId ? (
                                                    <>
                                                        <div className='thread-content-edit' style={{ display: 'none' }}>
                                                            <RichTextEditor content={currentThread.content} />
                                                        </div>
                                                        <div className='thread-user-actions'>
                                                            <button className='thread-edit-btn' onClick={toggleEdit}>
                                                                Edit Thread
                                                        </button>
                                                            <button className='thread-edit-submit-btn' onClick={submitEdit} style={{ display: 'none' }} >
                                                                Submit
                                                        </button>
                                                            <button className='thread-delete-btn' onClick={deletePost}>
                                                                Delete Thread
                                                        </button>
                                                        </div>
                                                    </>
                                                ) : <></>
                                            }
                                        </>) : <></>
                                        }
                                    </form>

                                </div>
                            </>

                        ) : <h1>Loading</h1>}
                    </div>
                </>
            ) : <h1>Loading</h1>}
            <ScrollToTop />
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
    };
};

const mapDispatchToProps = dispatch => {
    return {
        editThread: (...args) => dispatch(editThread(...args)),
        getCategories: () => dispatch(getCategories()),
        getThreads: (...args) => dispatch(getThreads(...args)),
    }
};

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(
    Thread
));