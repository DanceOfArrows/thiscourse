import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { getComments } from '../redux/category';

const Comments = props => {
    const { categoryId, getComments, threadId } = props;

    useEffect(() => {
        getComments(categoryId, threadId);
    }, [categoryId, getComments, threadId]);

    const commentsObj = props.categories[`category_${categoryId}`].threads[`thread_${threadId}`].comments;

    return (
        <>
            <div className='comments-container'>
                {props.categories && commentsObj ? (
                    <>
                        {Object.keys(commentsObj).map(comment => {
                            const currentComment = commentsObj[comment];
                            return (
                                <div key={comment} className='comment-container'>
                                    <div className='comment-content'>
                                        {currentComment.content}
                                    </div>
                                </div>
                            )
                        })}
                    </>) : <h1>Loading</h1>}
            </div>
        </>
    )
}

const mapStateToProps = state => {
    return {
        categories: state.category.categories,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        getComments: (...args) => dispatch(getComments(...args))
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    Comments
);