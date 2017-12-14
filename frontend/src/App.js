import React, { Component } from 'react';
import SearchBar from './components/SearchBar';
import ImageGrid from './components/ImageGrid';

class App extends Component {

  

  render() {
  
    var imagedata = [];
    for(var i = 0; i< 41; i++) { 
      var str = i >= 10 ? '0000' : '00000';
      imagedata.push(`${str}${i}.jpg`)
    }

    return (
      <div className="App" style={appStyle}>
        <SearchBar onClick={() => console.log('search tapped')}/>
        <ImageGrid imageData={imagedata} style={{ marginTop: 8 }}/>
      </div>
    );
  }
}
const appStyle = {
  padding: 0,
  margin: 4
}
export default App;
