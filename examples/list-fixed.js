const React = require('react')
const ReactDOM = require('react-dom')

const Virtue = require('..')

module.exports = function run () {
  const fixedRow = index => (
    <div>
      {index + 1}
      . Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sodales tellus a venenatis rhoncus. Donec gravida, eros vitae tincidunt fermentum, mi ipsum tincidunt nunc, sed fermentum est ante id neque. Pellentesque ac luctus urna, vel feugiat ipsum. Aliquam at nulla sit amet dui euismod hendrerit. Nam ut leo at augue consectetur mattis vitae a elit. Phasellus varius sagittis nisi rutrum ultrices. Praesent sed felis id nulla fermentum sagittis. Mauris laoreet dui diam, nec iaculis quam tempor in. Nullam consequat, tortor vitae ultrices condimentum, velit ligula hendrerit diam, ac sagittis ligula massa a urna.
    </div>
  )

  ReactDOM.render(
    <Virtue
      rowCount={500}
      height={window.innerHeight}
      scrollIndex={200}
      rowRenderer={fixedRow}
    />,
    document.getElementById('list-fixed')
  )
}
