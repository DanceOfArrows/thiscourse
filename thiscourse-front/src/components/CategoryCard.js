import React, { } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import './styles/CategoryCard.css';

const CategoryCard = (props) => {
    // Access category using id that was passed in
    const categoryInfo = props.categories[`category_${props.categoryId}`];

    return (
        <>
            <div className='categoryCard-container'>
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

    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    CategoryCard
);