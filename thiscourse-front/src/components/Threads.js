import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

const epochToDate = (epoch) => {
    const date = new Date(epoch);
    const monthsArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const month = monthsArr[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    return (`${month} ${day}, ${year}`);
}

const Threads = (props) => {
    const categoryId = props.categoryId;
    const isStickied = props.isStickied;
    return (
        <>
            {
                props.categories[`category_${categoryId}`].threads ? (
                    Object.keys(props.categories[`category_${categoryId}`].threads).map(thread => {
                        const threadObj = props.categories[`category_${categoryId}`].threads[thread];
                        // const threadId = parseInt(thread.match(/\d+/), 10);
                        const threadTitleUri = encodeURI(threadObj.title);

                        const createdDate = epochToDate(threadObj.createdAt);
                        // const updatedDate = epochToDate(threadObj.updatedAt);

                        if (threadObj.category_id === categoryId && threadObj.is_stickied === isStickied) {
                            return (
                                <div
                                    className='category-threads-threadContainer'
                                    key={thread}
                                >
                                    <div className='category-threads-ownerImg'>
                                        <NavLink to={`/u/${threadObj.threadOwner.display_name}`}>
                                            <img src={threadObj.threadOwner.profile_img} alt='Profile Icon' />
                                        </NavLink>
                                        <span className='category-threads-imgTooltip'>
                                            /u/{threadObj.threadOwner.display_name}
                                        </span>
                                    </div>
                                    <div className='category-threads-info'>
                                        <div className='category-threads-title'>
                                            <NavLink to={`/t/${categoryId}-${threadTitleUri}`}>
                                                {threadObj.title}
                                            </NavLink>
                                        </div>
                                        <div className='category-threads-ownerStarted'>
                                            <NavLink to={`/u/${threadObj.threadOwner.display_name}`}>
                                                {threadObj.threadOwner.display_name}
                                            </NavLink> - {createdDate}
                                        </div>
                                    </div>
                                    <div className='category-threads-stats'>

                                        {/* <div className='category-threads-updated'>
                                    {updatedDate}
                                </div> */}
                                    </div>
                                </div>
                            )
                        }
                        return null;
                    })
                ) : <h1>Loading</h1>
            }
        </>
    )
}

const mapStateToProps = state => {
    return {
        categories: state.category.categories,
    };
};

const mapDispatchToProps = dispatch => {
    return {}
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    Threads
);