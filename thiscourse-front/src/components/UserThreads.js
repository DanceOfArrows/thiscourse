import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { epochToDate } from './Threads';

const UserThreads = (props) => {
    return (
        <>
            {
                props.userThreads ? (
                    Object.keys(props.userThreads).map(thread => {
                        const threadObj = props.userThreads[thread];
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
    return {
        userThreads: state.user.account.threads,
    };
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