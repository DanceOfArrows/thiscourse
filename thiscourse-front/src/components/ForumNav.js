import React, { } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';


const ForumNav = (props) => {
    let currentCategory = `category_${props.categoryId}`;
    let categoriesNav = [props.categories[currentCategory].name];

    while (props.categories[currentCategory].parent_category) {
        currentCategory = `category_${props.categories[currentCategory].parent_category}`;
        categoriesNav.unshift(props.categories[currentCategory].name);
    }

    console.log(categoriesNav)

    return (
        <>
            <div className='forumNav-container'>
                <NavLink to='/'>
                    Home
                </NavLink>
                {
                    categoriesNav.map(category => {
                        return (
                            <NavLink key={category} to={`/c/${category}`}>
                                {category}
                            </NavLink>
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