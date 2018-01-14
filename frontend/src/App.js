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
    this.props.searchPressed();
    this.props.getImages(this.props.currentSearchText);
  }

  onSearchTextChange = (value) => {
    this.props.searchTextChanged(value);
  }

  onSelectImage = (name) => {
    this.props.selectImage(name);
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
          onChange={value => this.onSearchTextChange(value)}
        />
        <ImageGrid imagesSrcs={imagedata} selectedImagesSrcs={this.props.selectedImages} style={appStyles.imageGrid} onClickElement={name => this.onSelectImage(name)} />
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
    images: state.imagesReducer.images,
    selectedImages: state.imagesReducer.selectedImages,
    step: state.imagesReducer.step,
    fetching: state.imagesReducer.fetching,
    currentSearchText: state.searchReducer.currentSearchText
  }
}

function mapDispatchToProps(dispatch) {
  const {
    getImages,
    getImagesSuccess,
    getImagesFailure,
    selectImage
  } = imagesActions;
  const {
    searchTextChanged,
    searchPressed
  } = searchActions;
  return {
    getImages: compose(dispatch, getImages),
    getImagesSuccess: compose(dispatch, getImagesSuccess),
    getImagesFailure: compose(dispatch, getImagesFailure),
    selectImage: compose(dispatch, selectImage),
    searchTextChanged: compose(dispatch, searchTextChanged),
    searchPressed: compose(dispatch, searchPressed),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
