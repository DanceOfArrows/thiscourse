import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import CategoryCard from './CategoryCard';
import ForumNav from './ForumNav';
import './styles/Category.css';
import { getCategories, getThreads } from '../redux/category';

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
        getThreads(categoryId);
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
                        <div className='category-threads-utils-container'>

                        </div>
                        <div className='category-threads-container'>
                            <div className='category-threads-stickied'>
                                {
                                    props.threads ? (
                                        Object.keys(props.threads).map(thread => {
                                            const threadObj = props.threads[thread];
                                            if (threadObj.category_id === categoryId && threadObj.is_stickied) {
                                                return (
                                                    <div
                                                        className='category-threads-threadContainer'
                                                        key={thread}
                                                    >
                                                        <div className='category-threads-title'>
                                                            {threadObj.title}
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