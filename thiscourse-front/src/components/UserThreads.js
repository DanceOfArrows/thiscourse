import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { epochToDate } from './Threads';

const UserThreads = (props) => {
    let threads;
    if (props.profiles[`user_${props.user_id}`].threads) {
        threads = props.profiles[`user_${props.user_id}`].threads;
    }
    return (
        <>
            {
                threads ? (
                    Object.keys(threads).map(thread => {
                        const threadObj = threads[thread];
                        const threadTitleUri = encodeURI(threadObj.title);
                        const createdDate = epochToDate(threadObj.createdAt);

                        return (
                            <div
                                className='user-threads-threadContainer'
                                key={thread}
                            >
                                <div className='user-threads-info'>
                                    <div className='user-threads-title'>
                                        <NavLink to={`/t/${threadObj.category_id}-${threadTitleUri}`}>
                                            {threadObj.title}
                                        </NavLink>
                                    </div>
                                    <div className='user-threads-ownerStarted'>
                                        {createdDate}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                ) : <h1>Loading</h1>
            }
        </>
    )
}

const mapStateToProps = state => {
    if (state.user.public_profiles) {
        return {
            profiles: state.user.public_profiles,
        };
    }
};

const mapDispatchToProps = dispatch => {
    return {}
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    UserThreads
);