import React from 'react';
import CollectionList from './CollectionList';

const CollectionHolder = (props) => {
    const data = props.collectionData;
    return (
        <div className="collection-holder">
            <CollectionList data={data}/>
        </div>
    );
};

export default CollectionHolder;