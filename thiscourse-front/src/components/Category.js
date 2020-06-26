import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import CategoryCard from './CategoryCard';
import ForumNav from './ForumNav';
import Threads from './Threads';
import './styles/Category.css';
import { getCategories, getThreads } from '../redux/category';

const Category = (props) => {
    const path = props.location.pathname;
    const pathSplit = path.split('/');
    const currentCategoryName = pathSplit[2];

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
        if (!props.categories) getCategories();
    }, [getCategories, props.categories])
    useEffect(() => {
        if (categoryId) getThreads(categoryId);
    }, [categoryId, getThreads]);

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
                                <Threads categoryId={categoryId} isStickied={true} />
                            </div>
                            <div className='category-threads'>
                                <div className='category-threads-normHeader'>
                                    Regular Threads
                                    <NavLink to={`${path}/new-thread`}>
                                        <button className='category-threads-post'>
                                            <i className="far fa-edit"></i>
                                            Create Thread
                                        </button>
                                    </NavLink>
                                </div>
                                <Threads categoryId={categoryId} isStickied={false} />
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