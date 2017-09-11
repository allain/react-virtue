const React = require('react')
const PropTypes = require('prop-types')
const ReactDOM = require('react-dom')
const Virtue = require('..')

module.exports = function run() {
  const expanded = {} // map from index => boolean

  class ExpandableRow extends React.Component {
    render() {
      let { index, expanded, onExpand } = this.props

      return expanded ? (
        <div>
          {index + 1}
          . Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras
          sodales tellus a venenatis rhoncus. Donec gravida, eros vitae
          tincidunt fermentum, mi ipsum tincidunt nunc, sed fermentum est ante
          id neque. Pellentesque ac luctus urna, vel feugiat ipsum. Aliquam at
          nulla sit amet dui euismod hendrerit. Nam ut leo at augue consectetur
          mattis vitae a elit. Phasellus varius sagittis nisi rutrum ultrices.
          Praesent sed felis id nulla fermentum sagittis. Mauris laoreet dui
          diam, nec iaculis quam tempor in. Nullam consequat, tortor vitae
          ultrices condimentum, velit ligula hendrerit diam, ac sagittis ligula
          massa a urna.
        </div>
      ) : (
        <div>
          <button onClick={() => onExpand(index)}>Expand {index}</button>
        </div>
      )
    }

    expand() {
      this.setState({ expanded: true })
    }
  }

  ExpandableRow.propTypes = {
    index: PropTypes.number.isRequired,
    expanded: PropTypes.bool.isRequired,
    onExpand: PropTypes.func.isRequired
  }

  const dynamicRow = index => (
    <ExpandableRow
      index={index}
      expanded={!!expanded[index]}
      onExpand={onExpand}
    />
  )

  const list = ReactDOM.render(
    <Virtue
      rowCount={500}
      height={window.innerHeight}
      startIndex={200}
      rowRenderer={dynamicRow}
    />,
    document.getElementById('list-dynamic')
  )

  function onExpand(index) {
    expanded[index] = true
    list.forceUpdate()
  }
}
