import React, { Component } from 'react';
import SearchBar from './components/SearchBar';
import { Button, Typography, CircularProgress } from 'material-ui'
import { connect } from 'react-redux'
import * as imagesActions from './redux/actions/imagesActions';
import * as searchActions from './redux/actions/searchActions';
import * as screenWidthActions from './redux/actions/screenWidthActions';

import Gallery from 'react-photo-gallery';
import SelectedImage from './components/SelectedImage';
import ResizeAware from 'react-resize-aware';
import { compose } from './utils/compose'

class App extends Component {

  onSubmitClicked = (event) => {
    if(this.props.loading) return;
    this.props.postFeedback();
  }

  onSearchClick = (event) => {
    if (this.props.loading) return;
    let searchValue = this.props.currentSearchText.trim();
    if (searchValue) {
      this.props.searchTextChanged(searchValue);
      this.props.searchPressed();
      this.props.getImages(this.props.currentSearchText);
    }
  }

  onSearchTextChange = (value) => {
    this.props.searchTextChanged(value);
  }

  onSelectImage = (event, obj) => {
    this.props.selectImage(obj.photo);
  }

  render() {
    const middleComponent = () => {
      if (this.props.loading){
        return(
          <div style={appStyles.progressContainer}>
            <CircularProgress thickness={3} size={150} style={appStyles.progress} />
          </div>
        );
      }
      else {
        if (this.props.images) {
          const desiredImageSize = 360
          return (
            <div style={appStyles.imageGrid}>
              <ResizeAware 
                onResize={({width}) => this.props.screenWidthChanged(width)}>
                  <Gallery 
                    photos={this.props.images}
                    onClick={this.onSelectImage} 
                    ImageComponent={SelectedImage} 
                    margin={4}
                    columns={this.props.screenWidth <= desiredImageSize*2 ? 2 : (this.props.screenWidth <= desiredImageSize*4 ? 4 : 5) }
                  />
              </ResizeAware>
              <Button 
                raised 
                style={appStyles.submitButton} 
                onClick={event => this.onSubmitClicked(event)}>
                  Submit
              </Button>
            </div>
          );
        } else {
          if (this.props.error){
            const { error } = this.props;
            return (
              <div style={appStyles.progressContainer}>
                <Typography style={appStyles.errorText}>
                  {error.message}<br></br>{error.response ? error.response : null}
                </Typography>
                
            </div>
            );
          }
          else {
          return (
            <div style={appStyles.progressContainer}>
              <Typography style={appStyles.successText}>
                1. Provide a search query.
                <br></br>
                2. Select relevant images corresponding to your query.
                <br></br>
                3. Submit your feedback.
                <br></br>
                4. Repeat
              </Typography>
            </div>
          );
        }
        }
      }
    }
    return (
      <div className="App" style={appStyles.app}>
        <SearchBar 
          searchTextValue={this.props.currentSearchText}
          onClick={event => this.onSearchClick(event)} 
          onChange={value => this.onSearchTextChange(value)}
        />
        {middleComponent()}
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
    marginTop: 20
  },
  submitButton: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 40, 
    marginBottom: 40, 
    display: 'block', 
    backgroundColor: 'rgb(66,133,244)',
    color: 'white'
  },
  successText: {
    fontSize: 25,
    textAlign: 'center',
    color: 'rgb(66,133,244)'
  },
  errorText: {
    fontSize: 25,
    textAlign: 'center',
    color: '#ff0033'
  },
  progressContainer: {
    width: '100%',
    height: '20%',
    margin: 'auto',
    display: 'flex',
    justifyContent: 'center',
    position: 'absolute',
    alignItems: 'center',
    top: '40%',
    left: 0,
    right: 0
  },
  progress: {
    color: 'rgb(66,133,244)',
  }
}

function mapStateToProps(state) {

  return {
    images: state.imagesReducer.images,
    step: state.imagesReducer.step,
    loading: state.imagesReducer.loading,
    error: state.imagesReducer.error,
    currentSearchText: state.searchReducer.currentSearchText,
    screenWidth: state.screenWidthReducer.screenWidth
  }
}

function mapDispatchToProps(dispatch) {
  const {
    getImages,
    getImagesSuccess,
    getImagesFailure,
    selectImage,
    postFeedback
  } = imagesActions;
  const {
    searchTextChanged,
    searchPressed
  } = searchActions;
  const {
    screenWidthChanged
  } = screenWidthActions
  return {
    getImages: compose(dispatch, getImages),
    getImagesSuccess: compose(dispatch, getImagesSuccess),
    getImagesFailure: compose(dispatch, getImagesFailure),
    selectImage: compose(dispatch, selectImage),
    postFeedback: compose(dispatch, postFeedback),
    searchTextChanged: compose(dispatch, searchTextChanged),
    searchPressed: compose(dispatch, searchPressed),
    screenWidthChanged: compose(dispatch, screenWidthChanged)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
