import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { WithContext as ReactTags } from 'react-tag-input';

import RichTextEditor from './RichTextEditor';
import { createThread, getCategories } from '../redux/category';
import { getCurrentContent } from '../redux/createThread';
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
    }, [getCategories, props.redirect]);

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
        const user_id = postFormData.get('user_id');
        props.createThread({ user_id, title, content: props.textContent, tags }, categoryId, props.token);
    }

    if (props.redirect) return (<Redirect to={`/c/${currentCategoryName}`} />);

    return (
        props.categories ? (
            <>
                <div className='thread-post-container'>
                    <div className='thread-post-form'>
                        <form id='thread-post-form' onSubmit={handleSubmit}>
                            <input type='hidden' name='user_id' value={props.user.userId} />
                            <input
                                type='text'
                                name='title'
                                onChange={updateTitle}
                                placeholder='Title'
                                maxLength={255}
                            />
                            <RichTextEditor getContent={props.getCurrentContent} />
                            <div className='thread-tags-container'>
                                <ReactTags
                                    tags={threadData.tags}
                                    maxLength={24}
                                    handleDelete={handleDelete}
                                    handleAddition={handleAddition}
                                    delimiters={delimiters}
                                    allowDragDrop={false}
                                />
                                <div className="far fa-question-circle">
                                    <span className='thread-post-tagsTooltip'>
                                        Hit enter or use ',' to separate tags
                                    </span>
                                </div>
                            </div>
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
        redirect: state.category.redirect,
        textContent: state.createThread.textContent,
        user: state.user.account,
        token: state.user.session.token,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        createThread: (...args) => dispatch(createThread(...args)),
        getCategories: () => dispatch(getCategories()),
        getCurrentContent: (...args) => dispatch(getCurrentContent(...args)),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    CreateThread
);