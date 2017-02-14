import React, {Component} from 'react';

class CollectionForm extends Component {
    constructor(props) {
        super(props);

        console.log(props);
        this.state = {
            fields: props.formData.fields,
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