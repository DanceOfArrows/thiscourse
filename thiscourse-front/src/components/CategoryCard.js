import React, { } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import './styles/CategoryCard.css';

const CategoryCard = (props) => {
    // Access category using id that was passed in
    const categoryInfo = props.categories[`category_${props.categoryId}`];

    return (
        props.categories ? (
            <>
                <div className='categoryCard-container'>
                    <div className='categoryCard-category-container'>
                        <div className='categoryCard-icon'>
                            <img src={categoryInfo.category_img} alt='No Icon!' />
                        </div>
                        <div className='categoryCard-info'>
                            <NavLink to={`/c/${categoryInfo.name}`} className='categoryCard-info-title'>
                                {categoryInfo.name}
                            </NavLink>
                            <span className='categoryCard-info-description'>
                                {categoryInfo.description}
                            </span>
                        </div>
                        <div className='categoryCard-threadCount'>
                            {categoryInfo.thread_count}
                        </div>
                    </div>

                    <div className='categoryCard-subCategory-container'>
                        {
                            categoryInfo.subCategories.length === 0 ? (
                                <>
                                    <div className='categoryCard-subCategory-noSub'>
                                        No subcategories
                                </div>
                                </>
                            ) : (
                                    <>
                                        {
                                            categoryInfo.subCategories.map(subCategory => {
                                                const subCategoryInfo = props.categories[subCategory];
                                                return (
                                                    <div className='categoryCard-subCategory-info' key={subCategory}>
                                                        <div className="fas fa-caret-right" />
                                                        <div className='categoryCard-subCategory-title'>
                                                            <NavLink className='categoryCard-subCategory-title-link' to={`/c/${subCategoryInfo.name}`}>
                                                                {subCategoryInfo.name}
                                                            </NavLink>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        }
                                    </>
                                )
                        }
                    </div>
                </div>
            </>
        ) : (
                <h1>Loading</h1>
            )
    )
}

const mapStateToProps = state => {
    return {
        categories: state.category.categories,
    };
};

const mapDispatchToProps = dispatch => {
    return {

    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    CategoryCard
);