import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import CategoryCard from './CategoryCard';
import './styles/CategoryCard.css';
import { getCategories } from '../redux/category';

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

    const { getCategories } = props;

    useEffect(() => {
        getCategories();
    }, [getCategories]);

    return (
        props.categories ? (
            <>
                <div className='category-container'>
                    <div className='category-header-container'>
                        <CategoryCard categoryId={categoryId} />
                    </div>
                    <div className='category-threads-container'>

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
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    Category
);