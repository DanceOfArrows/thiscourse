import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import RichTextEditor from './RichTextEditor';
import { getCategories } from '../redux/category';

const CreateThread = (props) => {
    const [threadData, setThreadData] = useState({
        title: '',
        content: '',
    })

    const path = props.location.pathname;
    const splitPath = path.split('/');
    const currentCategoryName = splitPath[2];

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

    const updateProperty = property => e => {
        setThreadData({
            ...threadData,
            [property]: e.target.value
        });
    }

    const updateTitle = updateProperty('username');

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(currentCategoryName);
    }


    return (
        props.categories ? (
            <>
                <div className='thread-post-container'>
                    <div className='thread-post-form'>
                        <form onSubmit={handleSubmit}>
                            <input
                                type='text'
                                name='title'
                                onChange={updateTitle}
                                placeholder='Title'
                            />
                            <RichTextEditor />
                            <button type='submit'>Create Thread</button>
                        </form>
                    </div>
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
    CreateThread
);