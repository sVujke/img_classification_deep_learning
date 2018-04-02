import React, { Component } from 'react';
import SearchBar from './components/SearchBar';
import SuggestionBar from './components/SuggestionBar';
import { Button, Typography, CircularProgress } from 'material-ui'
import { connect } from 'react-redux'
import * as imagesActions from './redux/actions/imagesActions';
import * as searchActions from './redux/actions/searchActions';
import * as screenWidthActions from './redux/actions/screenWidthActions';
import * as imageUploadActions from './redux/actions/imageUploadActions';

import Gallery from 'react-photo-gallery';
import SelectedImage from './components/SelectedImage';
import DropZoneComponent from './components/DropZoneComponent';
import ResizeAware from 'react-resize-aware';
import { compose } from './utils/compose'

class App extends Component {

  onSubmitClicked = (event) => {
    if (this.props.loading || this.props.uploading) return;
    this.props.postFeedback();
  }

  onSearchClick = (event) => {
    if (this.props.loading || this.props.uploading) return;
    let searchValue = this.props.currentSearchText.trim();
    if (searchValue) {
      this.makeNewSearch(searchValue)
    }
  }

  makeNewSearch = (value) => {
    this.props.searchTextChanged(value);
    this.props.searchPressed();
    this.props.getImages(value);
  }

  onSearchTextChange = (value) => {
    this.props.searchTextChanged(value);
  }

  onSelectImage = (event, obj) => {
    this.props.selectImage(obj.photo);
  }

  onSynonymClick = (synonym) => {
    this.makeNewSearch(synonym)
  }

  onImageDrop = (acceptedFiles, rejectedFiles) => {
    if (this.props.uploading || this.props.loading) { return }
    console.log(acceptedFiles)
    console.log(rejectedFiles)

    if (acceptedFiles != null && acceptedFiles.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64imageString = reader.result;
        this.props.setDropzoneDisplayImage(base64imageString)
      };
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');

      reader.readAsDataURL(acceptedFiles[0]);
    }
  }

  onUploadClicked = (event) => {
    this.props.uploadImage()
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
          <div>
            {this.props.synonyms != null && this.props.synonyms.length > 0 ? <SuggestionBar style={appStyles.suggestionBar} synonyms={this.props.synonyms} onClick={(synonym) => this.onSynonymClick(synonym)}/> : null}
            {this.props.uploadPrompt === true ? 
              <div style={appStyles.uploadPromptContaner}>
                {this.props.uploadError == null
                  ? <div><Typography style={appStyles.successText}>Oops! This word is unfamiliar :(</Typography>
                    <Typography style={appStyles.successText}>Please, provide an example image of what you are looking for.</Typography></div>
                  : <Typography style={appStyles.errorText}>{this.props.uploadError.message}</Typography>}
                <DropZoneComponent disabled={this.props.uploading || this.props.loading} style={appStyles.dropZoneContainer} base64image={this.props.dropzoneDisplayBase64image} onDrop={this.onImageDrop.bind(this)} />
                {this.props.uploading ? <CircularProgress thickness={3} size={40} style={appStyles.uploadProgress} />
                  : <Button disabled={this.props.dropzoneDisplayBase64image == null} raised style={this.props.dropzoneDisplayBase64image == null ? appStyles.submitButtonDisabled : appStyles.submitButton} onClick={event => this.onUploadClicked(event)}>Upload</Button>}
                <Typography style={appStyles.successText}>Or browse through random images</Typography>
              </div>
              : null}
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
          </div>
          );
        } else {
          if (this.props.error){
            return (
              <div style={appStyles.progressContainer}>
                <Typography style={appStyles.errorText}>
                  {this.props.error.message}
                </Typography>
                
            </div>
            );
          }
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
  suggestionBar: {
    marginTop: 12
  },
  imageGrid: { 
    marginTop: 12
  },
  uploadPromptContaner: {
    margin: 'auto',
    marginTop: 12,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    width: '100%',
    left: 0,
    right: 0
  },
  dropZoneContainer: {
    marginTop: 40,
    backgroundColor: '#f7f7f7',
    padding: 12,
    width: '55%',
    minWidth: 180,
    maxWidth: 640,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  selectImageButton: {
    backgroundColor: 'rgb(66,133,244)',
    color: 'white',
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'block',
    marginBottom: 12,
    marginTop: 12
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
  submitButtonDisabled: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 40,
    marginBottom: 40,
    display: 'block',
    backgroundColor: '#d1d1d1',
    color: '#9b9b9b'
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
    color: 'rgb(66,133,244)'
  },
  uploadProgress: {
    color: 'rgb(66,133,244)',
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'block', 
    marginTop: 40,
    marginBottom: 40
  }
}

function mapStateToProps(state) {

  return {
    images: state.imagesReducer.images,
    step: state.imagesReducer.step,
    loading: state.imagesReducer.loading,
    error: state.imagesReducer.error,
    currentSearchText: state.searchReducer.currentSearchText,
    screenWidth: state.screenWidthReducer.screenWidth,
    synonyms: state.synonymsReducer.synonyms,
    dropzoneDisplayBase64image: state.imageUploadReducer.base64image,
    uploadPrompt: state.imageUploadReducer.prompted,
    uploading: state.imageUploadReducer.uploading,
    uploadError: state.imageUploadReducer.error
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
  const {
    setDisplayImage,
    uploadImage
  } = imageUploadActions;
  return {
    getImages: compose(dispatch, getImages),
    getImagesSuccess: compose(dispatch, getImagesSuccess),
    getImagesFailure: compose(dispatch, getImagesFailure),
    selectImage: compose(dispatch, selectImage),
    postFeedback: compose(dispatch, postFeedback),
    searchTextChanged: compose(dispatch, searchTextChanged),
    searchPressed: compose(dispatch, searchPressed),
    screenWidthChanged: compose(dispatch, screenWidthChanged),
    setDropzoneDisplayImage: compose(dispatch, setDisplayImage),
    uploadImage: compose(dispatch, uploadImage)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
