import React, { } from 'react';
import { connect } from 'react-redux';

import './styles/CategoryCard.css';

const CategoryCard = (props) => {
    // Access category using id that was passed in
    const categoryInfo = props.categories[`category_${props.categoryId}`];
    return (
        <>
            <div className='categoryCard-container'>
                <div className='categoryCard-icon'>
                    <img src='https://res.cloudinary.com/lullofthesea/image/upload/v1592596598/Thiscourse/axfsejoky6a2jc0gpxoq.png' alt='test icon' />
                </div>
                <div className='categoryCard-info'>
                    <a href='/' className='categoryCard-info-title'>
                        {categoryInfo.name}
                    </a>
                    <span className='categoryCard-info-description'>
                        {categoryInfo.description}
                    </span>
                </div>
                <div className='categoryCard-threadCount'>
                    0
                </div>
            </div>
        </>
    )
}

const mapStateToProps = state => {
    return {
        categories: state.home.categories,
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