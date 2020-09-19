import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import renderHTML from 'react-render-html';

import './styles/Profile.css';
import { getUser, getUserThreads, submitProfileEdit } from '../redux/user';
import { getCurrentContent } from '../redux/createThread';
import RichTextEditor from './RichTextEditor';
import UserThreads from './UserThreads';

const Profile = (props) => {
    const path = props.location.pathname;
    const pathSplit = path.split('/');
    const display_name = pathSplit[2];

    const { getUser, getUserThreads } = props;

    useEffect(() => {
        getUser(display_name);
    }, [display_name, getUser])

    let currentProfile;

    const [imagePreview, setImagePreview] = useState({ file: '', imagePreviewUrl: '', edited: false })
    const [textEdited, setTextEdited] = useState({ active: false })

    if (props.profiles) {
        Object.keys(props.profiles).forEach(profile => {
            const profileObj = props.profiles[profile];

            if (profileObj.display_name === display_name) {
                currentProfile = profileObj;
            }
        })
    }

    let user_id;
    if (currentProfile) {
        user_id = currentProfile.user_id;
    }
    useEffect(() => {
        getUserThreads(user_id);
    }, [getUserThreads, user_id])

    const handleSubmit = (e) => {
        e.preventDefault();
        const editForm = document.querySelector('.profile-edit-form');
        let editFormData = null;
        if (imagePreview.edited) {
            editFormData = new FormData(editForm);
            editFormData.append('image', imagePreview.file);
        }
        let bioContent = null;
        if (props.content) bioContent = props.content;

        props.submitProfileEdit(editFormData, bioContent, props.token);
        setImagePreview({
            ...imagePreview,
            edited: false,
        });
        setTextEdited({ ...textEdited, active: false });
        toggleEdit();
    }

    const handleImageChange = (e) => {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            setImagePreview({
                file: file,
                imagePreviewUrl: reader.result,
                edited: true,
            });
        }

        reader.readAsDataURL(file)
    }

    const toggleEdit = (e) => {
        if (e) e.preventDefault();
        const bio = document.querySelector('.profile-bio-content');
        const bioEdit = document.querySelector('.profile-bio-edit')
        const editBox = document.querySelector('.profile-text-editor');

        if (editBox && editBox.style.display === 'none') {
            bio.style.display = 'none';
            bioEdit.style.display = 'none';
            editBox.style.display = 'flex';
            setTextEdited({ ...textEdited, active: true });
        } else {
            bio.style.display = 'block';
            bioEdit.style.display = 'block';
            editBox.style.display = 'none';
            if (!props.content) setTextEdited({ ...textEdited, active: false });
        }
    }

    let { imagePreviewUrl } = imagePreview;
    let $imagePreview = null;
    if (imagePreviewUrl) {
        $imagePreview = (<img className='profile-image' src={imagePreviewUrl} alt='New PFP' />);
    } else {
        $imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
    }
    let editControls = false;
    if ((props.account && currentProfile) && props.account.display_name === currentProfile.display_name) {
        editControls = true;
    }

    return (
        <>
            {currentProfile ? (
                <>
                    <form className='profile-edit-form' onSubmit={(e) => handleSubmit(e)}>
                        <div className='profile-container'>
                            <div className='profile-card'>
                                <div className='profile-name'>
                                    {currentProfile.display_name}
                                </div>
                                <div className='profile-image-container'>
                                    <input
                                        type="file"
                                        id="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageChange(e)}
                                    />
                                    {editControls ? (
                                        <>
                                            <label htmlFor="file" className="profile-select-img" style={{ display: 'block' }}>
                                                <img className='profile-image-edit' src={currentProfile.profile_img} alt='Old PFP' />
                                            </label>
                                            <div className='profile-upload-container'>
                                                <i className="far fa-file-image"></i>
                                                <span className='profile-upload-text'>Upload</span>
                                            </div>
                                        </>
                                    ) : <>
                                            <img className='profile-image' src={currentProfile.profile_img} alt='Old PFP' />
                                        </>
                                    }
                                </div>
                                <div className='profile-bio'>
                                    <div className='profile-bio-content'>
                                        {renderHTML(currentProfile.bio)}
                                    </div>
                                    {editControls ? (
                                        <>
                                            <div className='profile-bio-edit' onClick={toggleEdit}>
                                                <i className="far fa-edit"></i>
                                                <span className='profile-bio-hover-text'>Edit</span>
                                            </div>
                                        </>
                                    ) : <></>}
                                    <div className='profile-text-editor' style={{ display: 'none' }}>
                                        <RichTextEditor content={currentProfile.bio} getContent={props.getCurrentContent} />
                                        <button className='profile-cancel-edit' onClick={toggleEdit}>
                                            Exit
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {imagePreview.edited || textEdited.active || textEdited.edited ? (
                                <>
                                    <div className="fas fa-long-arrow-alt-right"></div>
                                    <div className='new-profile-container'>

                                    </div>
                                    <div className='new-profile-card'>
                                        <div className='profile-name'>
                                            {currentProfile.display_name}
                                        </div>
                                        <div className='profile-image-container'>
                                            <div className="imgPreview">
                                                {$imagePreview}
                                            </div>
                                        </div>
                                        <div className='profile-bio'>
                                            <div className='profile-bio-content-edited'>
                                                {props.content ? (
                                                    renderHTML(props.content)
                                                ) : <>
                                                        {renderHTML(currentProfile.bio)}
                                                    </>}
                                            </div>
                                        </div>
                                    </div>

                                </>
                            ) : <></>}
                        </div>
                        {imagePreview.edited || textEdited.active || textEdited.edited ?
                            <button className="submitButton"
                                type="submit"
                                onClick={(e) => handleSubmit(e)}
                            >
                                Save
                            </button> : <></>
                        }

                    </form>
                    <div className='profile-user-threads'>
                        <div className='profile-user-threads-title'>User Threads</div>
                        <UserThreads user_id={user_id} />
                    </div>
                </>
            ) : <h1>Loading</h1>}

        </>
    )
}

const mapStateToProps = state => {
    if (state.user.session && state.user.account) {
        return {
            account: state.user.account,
            categories: state.category.categories,
            content: state.createThread.textContent,
            profiles: state.user.public_profiles,
            token: state.user.session.token,
        };
    }
    return {
        categories: state.category.categories,
        content: state.createThread.textContent,
        profiles: state.user.public_profiles,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getCurrentContent: (...args) => dispatch(getCurrentContent(...args)),
        getUser: (...args) => dispatch(getUser(...args)),
        getUserThreads: (...args) => dispatch(getUserThreads(...args)),
        submitProfileEdit: (...args) => dispatch(submitProfileEdit(...args))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    Profile
);