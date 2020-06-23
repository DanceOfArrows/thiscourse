import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import './styles/ForumNav.css';

const ForumNav = (props) => {
    let currentCategory = `category_${props.categoryId}`;
    let categoriesNav = [props.categories[currentCategory].name];

    while (props.categories[currentCategory].parent_category) {
        currentCategory = `category_${props.categories[currentCategory].parent_category}`;
        categoriesNav.unshift(props.categories[currentCategory].name);
    }

    return (
        <>
            <div className='forumNav-container'>
                <NavLink exact to='/' className='forumNav-home'>
                    Home
                </NavLink>
                {
                    categoriesNav.map(category => {
                        return (
                            <Fragment key={category}>
                                <div className="fas fa-chevron-right" />
                                <div className='forumNav-link-item'>
                                    <NavLink
                                        to={`/c/${category}`}
                                        activeClassName='forumNav-active-link'
                                    >
                                        {category}
                                    </NavLink>
                                </div>
                            </Fragment>
                        )
                    })
                }
            </div>
        </>
    );
};

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
    ForumNav
);