import React from 'react';
import CollectionForm from './CollectionForm';

const CollectionFormHolder = (props) => {
    return (
        <div className="collection-form-holder">
            <CollectionForm formData={props.formData} handleCollectionFilterSubmit={props.handleCollectionFilterSubmit} />
        </div>
    );
};

export default CollectionFormHolder;