const React = require('react')
const ReactDOM = require('react-dom')
const Virtue = require('..')

ReactDOM.render(
  <Virtue
    rowCount={500}
    height={window.innerHeight}
    defaultHeight={77}
    scrollIndex={200}
    rowRenderer={index => (
      <div>
        {index + 1}. {Array(2 + index).join('w ')}
      </div>
    )}
  />,
  document.getElementById('root')
)
