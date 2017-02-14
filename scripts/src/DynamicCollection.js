import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import CollectionFormHolder from './components/CollectionFromHolder';
import CollectionHolder from './components/CollectionHolder';
import $ from 'jquery';

const FilterFormHolder = document.getElementById('dynamic-collection');

class DynamicCollection extends Component {
    constructor(props) {
        super(props);

        this.state = {};
        this.fetchFormData = this.fetchFormData.bind(this);
        this.fetchCollectionData = this.fetchCollectionData.bind(this);
    }

    fetchFormData() {
        $.ajax({
            url: this.props.formDataUrl,
            //data: this.generateDataQuery(this.state.filter),
            dataType: 'json',
            type: 'GET',

            success: data => {
                this.setState({
                    formData: data
                });
            },

            error: (xhr, status, err) => {
                console.error(this.props.url, status, err.toString());
            }
        });
    }

    fetchCollectionData() {
        $.ajax({
            url: this.props.dataUrl,
            //data: this.generateDataQuery(this.state.filter),
            dataType: 'json',
            type: 'GET',

            success: data => {
                this.setState({
                    collectionData: data
                });
            },

            error: (xhr, status, err) => {
                console.error(this.props.url, status, err.toString());
            }
        });
    }

    componentWillMount() {
        this.fetchFormData();
        this.fetchCollectionData();
    }

    render() {
        return (
            <div className="collection">
                <CollectionFormHolder formData={this.state.formData}/>
                <CollectionHolder collectionData={this.state.collectionData}/>
            </div>
        );
    }
}
DynamicCollection.defaultProps = {
    dataUrl: 'http://silverstripe4.dev/collection/CollectionJSON',
    formDataUrl: 'http://silverstripe4.dev/collection/CollectionFormJSON',
    formData: {},
    collectionData: {},
};

ReactDOM.render(
    <DynamicCollection/>,
    FilterFormHolder
);

export default DynamicCollection;