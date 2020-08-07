import React from 'react';
import { NavLink } from 'react-router-dom';

import { epochToDate } from './Threads';

const UserThreads = (props) => {
    return (
        <>
            {
                props.userThreads ? (
                    Object.keys(props.userThreads.threads).map(thread => {
                        const threadObj = props.userThreads.threads[thread];
                        const threadTitleUri = encodeURI(threadObj.title);
                        const createdDate = epochToDate(threadObj.createdAt);

                        return (
                            <div
                                className='category-threads-threadContainer'
                                key={thread}
                            >
                                <div className='category-threads-info'>
                                    <div className='category-threads-title'>
                                        <NavLink to={`/t/${thread.category_id}-${threadTitleUri}`}>
                                            {threadObj.title}
                                        </NavLink>
                                    </div>
                                    <div className='category-threads-ownerStarted'>
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

export default UserThreads;
