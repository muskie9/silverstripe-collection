import React from 'react';
import CollectionListItem from './CollectionListItem';

const CollectionList = (props) => {
    if (props.data === undefined) {
        return null;
    } else {
        const data = props.data;
        return (
            <ul className="collection-list">
                {data.map(item => <CollectionListItem data={item}/>)}
            </ul>
        );
    }
};

export default CollectionList;