import React, { Component } from 'react';
import SearchBar from './components/SearchBar';
import ImageGrid from './components/ImageGrid';

class App extends Component {
  render() {
    return (
      <div className="App" style={appStyle}>
        <SearchBar onClick={() => console.log('search tapped')}/>
        <ImageGrid imageData={[1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1]}/>
      </div>
    );
  }
}
const appStyle = {
  padding: 0,
  margin: 4
}
export default App;
