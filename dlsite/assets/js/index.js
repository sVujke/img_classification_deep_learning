var React = require('react');
var ReactDOM = require('react-dom');
var createClass = require('create-react-class');

// Create component
var TodoComponent = createClass({
  render: function () {
    return(
      <h1>Hello!!</h1>
    );
  }
});

// put component into html page

ReactDOM.render(<TodoComponent />, document.getElementById('root'));