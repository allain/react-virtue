const React = require('react')
const PropTypes = require('prop-types')
const ReactHeight = require('react-height')
const objectValues = require('object-values')

class Virtue extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      scrollIndex: props.startIndex || 0,
      rowHeights: {},
      windowPosition: 0
    }
  }

  componentDidMount() {
    let startPosition = this._estimatePosition(this.state.scrollIndex)
    this.list.scrollTop = startPosition
    this.setState({
      windowPosition: startPosition
    })

    this.list.addEventListener('scroll', this.listenScrollEvent.bind(this))
  }

  componentWillUnmount() {
    this.list.removeEventListener('scroll', this.listenScrollEvent.bind(this))
  }

  listenScrollEvent(event) {
    const scrollIndex = this._estimateScrollIndex(this.list.scrollTop)

    this.setState({
      scrollIndex,
      windowPosition: this._estimatePosition(scrollIndex)
    })
  }

  render() {
    const {
      rowCount,
      rowRenderer,
      height,
      style = {},
      ...otherProps
    } = this.props

    const { scrollIndex, rowHeights } = this.state

    delete otherProps.scrollIndex
    delete otherProps.startIndex

    style.height = height + 'px'
    style.overflowY = 'scroll'

    let estimatedHeight = this._estimateHeight()
    const rows = []
    const scrollTop = this.list ? this.list.scrollTop : 0

    const estimatedRowHeight = this.estimateAvgRowHeight()
    let currentPos = this.state.windowPosition
    let currentIndex = scrollIndex
    do {
      rows.push(this._renderRow(currentIndex))
      currentPos += rowHeights[currentIndex++] || estimatedRowHeight
    } while (
      currentPos < scrollTop + height &&
      currentIndex < this.props.rowCount
    )

    return (
      <div ref={list => (this.list = list)} {...otherProps} style={style}>
        <div style={{ height: estimatedHeight }}>
          <div
            style={{
              position: 'relative',
              top: this.state.windowPosition + 'px'
            }}>
            {rows}
          </div>
        </div>
      </div>
    )
  }

  _renderRow(index) {
    return (
      <ReactHeight
        key={`row-${index}`}
        onHeightReady={height => this._updateRowHeight(index, height)}>
        {this.props.rowRenderer(index)}
      </ReactHeight>
    )
  }

  _estimateHeight() {
    return this.estimateAvgRowHeight() * this.props.rowCount
  }

  _estimatePosition(scrollIndex) {
    const avgRowHeight = this.estimateAvgRowHeight()
    let { rowHeights } = this.state

    if (scrollIndex === 0) return 0

    let computedIndexes = Object.keys(rowHeights).filter(i => i < scrollIndex)
    let computedHeights = computedIndexes.reduce(
      (total, index) => total + rowHeights[index],
      0
    )
    return (
      computedHeights +
      Math.floor(avgRowHeight * (scrollIndex - computedIndexes.length))
    )
  }

  _estimateScrollIndex(scrollTop) {
    const avgRowHeight = this.estimateAvgRowHeight()
    let { rowHeights } = this.state

    let currentIndex = 0
    let remainingHeight = scrollTop
    while (currentIndex < this.props.rowCount) {
      let rowHeight = rowHeights[currentIndex] || avgRowHeight
      if (rowHeight > remainingHeight) {
        return currentIndex
      }
      currentIndex++
      remainingHeight -= rowHeight
    }
  }

  estimateAvgRowHeight() {
    let heights = objectValues(this.state.rowHeights)

    // This value will get replaced as soon as the first row is measured
    if (heights.length === 0) return 100

    return Math.round(heights.reduce((sum, h) => sum + h, 0) / heights.length)
  }

  _updateRowHeight(index, height) {
    if (this.state.rowHeights[index] === height) return

    let startAvg = this.estimateAvgRowHeight()
    let lastScrollTop = this._estimatePosition(this.state.scrollIndex)
    let deltaScroll = this.list.scrollTop - lastScrollTop
    let emptyHeights = Object.keys(this.state.rowHeights).length === 0
    this.setState(
      oldState => ({
        ...oldState,
        rowHeights: {
          ...oldState.rowHeights,
          [index]: height
        }
      }),
      () => {
        let newScrollTop = this._estimatePosition(this.state.scrollIndex)
        this.list.scrollTop =
          newScrollTop + deltaScroll + (emptyHeights ? 0 : height - startAvg)
      }
    )
  }
}

Virtue.propTypes = {
  rowCount: PropTypes.number.isRequired,
  rowRenderer: PropTypes.func.isRequired,
  height: PropTypes.number.isRequired,
  startIndex: PropTypes.number,
  style: PropTypes.object
}

Virtue.defaultProps = {
  startIndex: 0
}

module.exports = Virtue
