/** @jsx React.DOM */
var React = require('react');
var Nav = require('./nav.react')
var Trucker = React.createClass({
  render: function() {
    return (
      <div>
        <Nav />
      </div>
    )
  }
});

window.onload = function() { React.renderComponent(<Trucker />, document.body) }

