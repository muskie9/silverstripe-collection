import React from 'react';

const CollectionListItem = (props) => {
    const record = props.data;
    return (
        <li key={record.ID} className="collection-list-item">
            <div>
                <span className="collection-item-title">{record.Title}</span>
            </div>
        </li>
    );
};

export default CollectionListItem;