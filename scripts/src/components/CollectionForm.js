import React, {Component} from 'react';

class CollectionForm extends Component {
    constructor(props) {
        super(props);

        const fields = (props.formData === undefined) ? [{}] : props.formData.fields;
        this.state = {
            fields: fields,
            handleSubmit: props.handleCollectionFilterSubmit,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit() {
        console.log('CollectionForm.handleSubmit');
    }

    render() {
        return (
            <form className="collection-form" onSubmit={this.handleSubmit}>
                ...
            </form>
        );
    }
}

export default CollectionForm;