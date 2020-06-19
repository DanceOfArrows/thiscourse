import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import CategoryCard from './CategoryCard';
import './styles/Home.css';
import { getCategories } from '../redux/home';

const Home = (props) => {
    const { getCategories } = props;

    useEffect(() => {
        getCategories();

    }, [getCategories]);

    return (
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
    )
}

const mapStateToProps = state => {
    return {
        categories: state.home.categories,
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