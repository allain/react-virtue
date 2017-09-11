const React = require('react')
const ReactDOM = require('react-dom')
const Virtue = require('..')

module.exports = function run() {
  const increasingRow = index => (
    <div>
      {index + 1}. {Array(2 + index).join('w ')}
    </div>
  )

  if (document.getElementById('list-increasing')) {
    ReactDOM.render(
      <Virtue
        rowCount={500}
        height={window.innerHeight}
        scrollIndex={200}
        rowRenderer={increasingRow}
      />,
      document.getElementById('list-increasing')
    )
  }
}
