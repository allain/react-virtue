const React = require('react')
const ReactDOM = require('react-dom')
const Virtue = require('..')

module.exports = function run() {
  const randomWords = {}

  const randomRow = index => {
    const randomHeight =
      randomWords[index] ||
      (randomWords[index] = Math.round(Math.random() * 200))
    return (
      <div>
        {index + 1}. {Array(randomHeight + 2).join('w ')}
      </div>
    )
  }

  ReactDOM.render(
    <Virtue
      rowCount={500}
      height={window.innerHeight}
      scrollIndex={200}
      rowRenderer={randomRow}
    />,
    document.getElementById('list-random')
  )
}
