import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import ForumNav from './ForumNav';
import { getCategories, getThreads } from '../redux/category';

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

    return (
        <>
            {props.categories ? (
                <>
                    <ForumNav categoryId={categoryId} title={title} />
                    <div className='thread-container'>
                        {currentThread ? (
                            <>
                                <div className='thread-left-section'></div>
                                <NavLink to={`/u/${currentThread.threadOwner.display_name}`} className='thread-owner-name'>
                                    {currentThread.threadOwner.display_name}
                                </NavLink>
                                <NavLink to={`/u/${currentThread.threadOwner.display_name}`} className='thread-owner-img'>
                                    <img src={currentThread.threadOwner.profile_img} />
                                </NavLink>
                                <div className='thread-create-date'>
                                    {epochToDate(currentThread.createdAt)}
                                </div>
                                <div className='thread-right-section'>
                                    <div className='thread-title'>{currentThread.title}</div>
                                    <div className='thread-content'>{currentThread.content}</div>
                                </div>
                            </>
                        ) : <h1>Loading</h1>}
                    </div>
                </>
            ) : <h1>Loading</h1>}
        </>
    )
}

const mapStateToProps = state => {
    return {
        categories: state.category.categories,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getCategories: () => dispatch(getCategories()),
        getThreads: (...args) => dispatch(getThreads(...args)),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    Thread
);