import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import CategoryCard from './CategoryCard';
import ForumNav from './ForumNav';
import './styles/Category.css';
import { getCategories, getThreads } from '../redux/category';

const epochToDate = (epoch) => {
    const date = new Date(epoch);
    const monthsArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const month = monthsArr[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    return (`${month} ${day}, ${year}`);
}

const Category = (props) => {
    const path = props.location.pathname;
    const currentCategoryName = path.substring(path.lastIndexOf('/') + 1);

    let categoryId;
    for (const category in props.categories) {
        const categoryName = props.categories[category].name;

        if (categoryName === currentCategoryName) {
            categoryId = parseInt(category.match(/\d+/), 10);
            break;
        }
    }

    const { getCategories, getThreads } = props;

    useEffect(() => {
        getCategories();
        if (categoryId) getThreads(categoryId);
    }, [categoryId, getCategories, getThreads]);

    return (
        props.categories ? (
            <>
                <ForumNav categoryId={categoryId} />
                <div className='category-container'>
                    <div className='category-header-container'>
                        <CategoryCard categoryId={categoryId} />
                    </div>
                    <div className='category-threadSection-container'>
                        <div className='category-threads-container'>
                            <div className='category-threads-stickied'>
                                <div className='category-threads-stickyHeader'>Sticky Threads</div>
                                {
                                    props.threads ? (
                                        Object.keys(props.threads).map(thread => {
                                            const threadObj = props.threads[thread];
                                            const threadId = parseInt(thread.match(/\d+/), 10);
                                            const threadTitleUri = encodeURI(threadObj.title);

                                            const createdDate = epochToDate(threadObj.createdAt);
                                            // const updatedDate = epochToDate(threadObj.updatedAt);

                                            if (threadObj.category_id === categoryId && threadObj.is_stickied) {
                                                return (
                                                    <div
                                                        className='category-threads-threadContainer'
                                                        key={thread}
                                                    >
                                                        <div className='category-threads-ownerImg'>
                                                            <NavLink to={`/u/${threadObj.threadOwner.display_name}`}>
                                                                <img src={threadObj.threadOwner.profile_img} alt='Profile Icon' />
                                                            </NavLink>
                                                            <span className='category-threads-imgTooltip'>
                                                                /u/{threadObj.threadOwner.display_name}
                                                            </span>
                                                        </div>
                                                        <div className='category-threads-info'>
                                                            <div className='category-threads-title'>
                                                                <NavLink to={`/t/${threadId}-${threadTitleUri}`}>
                                                                    {threadObj.title}
                                                                </NavLink>
                                                            </div>
                                                            <div className='category-threads-ownerStarted'>
                                                                <NavLink to={`/u/${threadObj.threadOwner.display_name}`}>
                                                                    {threadObj.threadOwner.display_name}
                                                                </NavLink> - {createdDate}
                                                            </div>
                                                        </div>
                                                        <div className='category-threads-stats'>

                                                            {/* <div className='category-threads-updated'>
                                                                {updatedDate}
                                                            </div> */}
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            return null;
                                        })
                                    ) : <h1>Loading</h1>
                                }
                            </div>
                            <div className='category-threads'>
                                <div className='category-threads-normHeader'>
                                    Regular Threads
                                    <NavLink to={`${path}/new-thread`}>
                                        <button className='category-threads-post'>
                                            <i class="far fa-edit"></i>
                                            Create Thread
                                        </button>
                                    </NavLink>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </>
        ) : <h1>Loading</h1>
    )
}

const mapStateToProps = state => {
    return {
        categories: state.category.categories,
        threads: state.category.threads,
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
    Category
);