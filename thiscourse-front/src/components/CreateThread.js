import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { WithContext as ReactTags } from 'react-tag-input';

import RichTextEditor from './RichTextEditor';
import { getCategories } from '../redux/category';
import './styles/CreateThread.css';

const KeyCodes = {
    comma: 188,
    enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

const CreateThread = (props) => {
    const [threadData, setThreadData] = useState({
        title: '',
        tags: [],
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

    const updateTitle = e => {
        setThreadData({
            ...threadData,
            title: e.target.value
        });
    }

    const handleAddition = (tag) => {
        setThreadData({
            ...threadData,
            tags: [...threadData.tags, tag],
        });
    }

    const handleDelete = (i) => {
        const { tags } = threadData;
        setThreadData({
            ...threadData,
            tags: tags.filter((tag, index) => index !== i),
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const postForm = document.getElementById('thread-post-form');
        const postFormData = new FormData(postForm);

        const { title, tags } = threadData;
        console.log(postFormData.get('category_id'))
        console.log(postFormData.get('user_id'))
        console.log(postFormData.get('is_locked'))
        console.log(postFormData.get('is_stickied'))
        console.log(postFormData.get('bump_time'))
    }


    return (
        props.categories ? (
            <>
                <div className='thread-post-container'>
                    <div className='thread-post-form'>
                        <form id='thread-post-form' onSubmit={handleSubmit}>
                            <input type='hidden' name='category_id' value={categoryId} />
                            <input type='hidden' name='user_id' value={props.user.userId} />
                            <input
                                type='text'
                                name='title'
                                onChange={updateTitle}
                                placeholder='Title'
                                maxLength={255}
                            />
                            <RichTextEditor />
                            <input type='hidden' name='is_locked' value={false} />
                            <input type='hidden' name='is_stickied' value={false} />
                            <input type='hidden' name='bump_time' value={new Date()} />
                            <ReactTags
                                tags={threadData.tags}
                                maxLength={24}
                                handleDelete={handleDelete}
                                handleAddition={handleAddition}
                                delimiters={delimiters}
                                allowDragDrop={false}
                            />
                            <button className='thread-post-submit' type='submit'>Create Thread</button>
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
        user: state.user.account,
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