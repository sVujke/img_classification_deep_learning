import React, { Component } from 'react';
import SearchBar from './components/SearchBar';
import ImageGrid from './components/ImageGrid';
import { Button } from 'material-ui'
import { connect } from 'react-redux'
import * as imagesActions from './redux/actions/imagesActions';
import * as searchActions from './redux/actions/searchActions';

import { compose } from './utils/compose'

class App extends Component {

  onSubmitClicked = (event) => {
    console.log('Submit clicked')
  }

  onSearchClick = (event) => {
    this.props.getImages('LMAO');
    this.props.searchPressed();
  }

  onSearchTextChange = (value) => {
    this.props.searchTextChanged(value);
  }

  render() {
  
    var imagedata = [];
    for(var i = 0; i< 41; i++) { 
      var str = i >= 10 ? '0000' : '00000';
      imagedata.push(`${str}${i}.jpg`)
    }

    return (
      <div className="App" style={appStyles.app}>
        <SearchBar 
          value={this.props.currentSearchText}
          onClick={event => this.onSearchClick(event)} 
          onChange={(value) => this.onSearchTextChange(value)}
        />
        <ImageGrid imageData={imagedata} style={appStyles.imageGrid}/>
        <Button raised style={appStyles.submitButton} onClick={event => this.onSubmitClicked(event)}>Submit</Button>
      </div>
    );
  }
}
const appStyles = {
  app: {
    padding: 0,
    margin: 12
  },
  imageGrid: { 
    marginTop: 48 
  },
  submitButton: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 48, 
    marginBottom: 48, 
    display: 'block', 
    backgroundColor: 'rgb(66,133,244)',
    color: 'white'
    }
}

function mapStateToProps(state) {
  return {
    images: state.images,
    selectedImages: state.selectedImages,
    step: state.step,
    fetching: state.fetching,
    currentSearchText: state.currentSearchText
  }
}

function mapDispatchToProps(dispatch) {
  const {
    getImages,
    getImagesSuccess,
    getImagesFailure
  } = imagesActions;
  const {
    searchTextChanged,
    searchPressed
  } = searchActions;
  return {
    getImages: compose(dispatch, getImages),
    getImagesSuccess: compose(dispatch, getImagesSuccess),
    getImagesFailure: compose(dispatch, getImagesFailure),
    searchTextChanged: compose(dispatch, searchTextChanged),
    searchPressed: compose(dispatch, searchPressed),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
