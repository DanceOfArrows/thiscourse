import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import CategoryCard from './CategoryCard';
import './styles/Home.css';
import { getCategories } from '../redux/category';

const Home = (props) => {
    const { getCategories } = props;

    useEffect(() => {
        getCategories();
    }, [getCategories]);

    return (
        props.categories ? (
            <>
                <div className='forum-container'>
                    <div className='forum-categories'>Categories</div>
                    {
                        props.categories ? Object.keys(props.categories).map(categoryObj => {
                            const categoryId = parseInt(categoryObj.match(/\d+/), 10);
                            return (
                                <CategoryCard key={categoryObj} categoryId={categoryId} />
                            )
                        }) : <h1>Hello</h1>
                    }
                </div>
            </>
        ) : <h1> Loading </h1>
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
    Home
);