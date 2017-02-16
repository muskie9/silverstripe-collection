import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import ReactPaginate from 'react-paginate';
import $ from 'jquery';
import CollectionFormHolder from './components/CollectionFromHolder';
import CollectionHolder from './components/CollectionHolder';

const FilterFormHolder = document.getElementById('dynamic-collection');

class DynamicCollection extends Component {
    constructor(props) {
        super(props);

        this.state = {
            itemRequestParams: props.itemRequestParams,
            offset: 0,
            pageCount: 0,
        };
        this.fetchFormData = this.fetchFormData.bind(this);
        this.fetchCollectionData = this.fetchCollectionData.bind(this);
        this.handleCollectionFilterSubmit = this.handleCollectionFilterSubmit.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
    }

    handlePageClick(data) {
        let selected = data.selected;
        let requestVars = this.state.itemRequestParams;
        requestVars.offset = Math.ceil(selected * requestVars.limit);

        this.setState({itemRequestParams: requestVars}, () => {
            this.fetchCollectionData();
        });
    }

    fetchCollectionTotal() {
        $.ajax({
            url: this.props.dataCountUrl,
            dataType: 'json',
            type: 'GET',

            success: data => {
                this.setState({
                    pageCount: Math.ceil(data.total_count / this.props.itemRequestParams.limit)
                });
            },

            error: (xhr, status, err) => {
                console.error(this.props.formDataUrl, status, err.toString());
            }
        });
    }

    fetchFormData() {
        $.ajax({
            url: this.props.formDataUrl,
            dataType: 'json',
            type: 'GET',

            success: data => {
                this.setState({
                    formData: data
                });
            },

            error: (xhr, status, err) => {
                console.error(this.props.formDataUrl, status, err.toString());
            }
        });
    }

    fetchCollectionData() {
        $.ajax({
            url: this.props.dataUrl,
            data: this.state.itemRequestParams,
            dataType: 'json',
            type: 'GET',

            success: data => {
                this.setState({
                    collectionData: data
                });
            },

            error: (xhr, status, err) => {
                console.error(this.props.dataUrl, status, err.toString());
            }
        });
    }

    componentWillMount() {
        this.fetchCollectionTotal();
        this.fetchFormData();
        this.fetchCollectionData();
    }

    handleCollectionFilterSubmit() {
        console.log('DynamicCollection.handleCollectionFilterSubmit');
    }

    render() {
        return (
            <div className="collection">
                <CollectionFormHolder formData={this.state.formData}
                                      handleCollectionFilterSubmit={this.handleCollectionFilterSubmit}/>
                <CollectionHolder collectionData={this.state.collectionData}/>
                <div className="pagination">
                    <ReactPaginate previousLabel={"previous"}
                                   nextLabel={"next"}
                                   breakLabel={<a href="">...</a>}
                                   breakClassName={"break-me"}
                                   pageCount={this.state.pageCount}
                                   marginPagesDisplayed={2}
                                   pageRangeDisplayed={5}
                                   onPageChange={this.handlePageClick}
                                   containerClassName={"pagination"}
                                   subContainerClassName={"pages pagination"}
                                   activeClassName={"active"}/>
                </div>
            </div>
        );
    }
}
DynamicCollection.defaultProps = {
    dataCountUrl: 'http://silverstripe4.dev/collection/collectiontotaljson',
    dataUrl: 'http://silverstripe4.dev/collection/collectionjson',
    formDataUrl: 'http://silverstripe4.dev/collection/collectionformjson',
    formData: {},
    collectionData: {},
    itemRequestParams: {
        limit: 10,
        sort: {
            Title: 'ACS',
        },
        offset: 0,
    }
};

ReactDOM.render(
    <DynamicCollection/>,
    FilterFormHolder
);

export default DynamicCollection;