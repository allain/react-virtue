const React = require('react')
const ReactDOM = require('react-dom')
const Virtue = require('..')

ReactDOM.render(
  <Virtue
    scrollIndex={100}
    rowCount={10000}
    height ={window.innerHeight}
    defaultHeight={77}
    rowRenderer={(index) => <div>{index+1}. {Array(2+(index % 50)).join('word ')}</div>}
  />,
  document.getElementById('root')
);