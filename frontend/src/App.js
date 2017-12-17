import React, { Component } from 'react';
import SearchBar from './components/SearchBar';
import ImageGrid from './components/ImageGrid';
import { Button } from 'material-ui'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as selectImagesActions from './redux/actions/selectImagesActions'

class App extends Component {

  onSubmitClicked = (event) => {
    console.log('Submit clicked')
  }

  render() {
  
    var imagedata = [];
    for(var i = 0; i< 41; i++) { 
      var str = i >= 10 ? '0000' : '00000';
      imagedata.push(`${str}${i}.jpg`)
    }

    return (
      <div className="App" style={appStyles.app}>
        <SearchBar onClick={() => console.log('search tapped')} />
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
    selectedImages: state.selectedImages
  }
}

function mapDispatchToProps(dispatch) {
  return {
    selectImagesActions: bindActionCreators(selectImagesActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
