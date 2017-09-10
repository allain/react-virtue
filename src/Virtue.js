const React = require('react')
const PropTypes = require('prop-types')
const ReactHeight = require('react-height')

class Virtue extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      scrollIndex: props.scrollIndex || 0,
      rowHeights: {},
      windowPosition: 0
    }

    window.v = this
  }

  componentDidMount() {
    //    setTimeout(() => {
    let startPosition = this._estimatePosition(this.state.scrollIndex)
    this.list.scrollTop = startPosition

    this.listenScrollEvent()
    //   }, 25)

    this.list.addEventListener('scroll', this.listenScrollEvent.bind(this))
  }

  componentWillUnmount() {
    this.list.removeEventListener('scroll', this.listenScrollEvent.bind(this))
  }

  listenScrollEvent(event) {
    let scrollIndex = this.estimateScrollIndex(this.list.scrollTop)
    let newWindowPos = this._estimatePosition(scrollIndex)

    this.setState(oldState => ({
      ...oldState,
      scrollIndex,
      windowPosition: newWindowPos
    }))
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
    delete otherProps.defaultHeight

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
    } while (currentPos < scrollTop + height)

    return (
      <div ref={list => (this.list = list)} {...otherProps} style={style}>
        <div style={{ height: estimatedHeight }}>
          <div
            style={{
              position: 'relative',
              top: this.state.windowPosition
              // pointerEvents: 'none'
            }}>
            {rows}
          </div>
        </div>
      </div>
    )
  }

  _renderRow(index) {
    const { rowRenderer } = this.props

    return (
      <ReactHeight
        key={`row-${index}`}
        onHeightReady={height => this._updateRowHeight(index, height)}>
        {rowRenderer(index)}
      </ReactHeight>
    )
  }

  _estimateHeight() {
    return this.estimateAvgRowHeight() * this.props.rowCount
  }

  _estimatePosition(scrollIndex) {
    const defaultHeight = this.estimateAvgRowHeight()
    let { rowHeights } = this.state

    if (scrollIndex === 0) return 0

    let computedIndexes = Object.keys(rowHeights).filter(i => i < scrollIndex)
    let computedHeights = computedIndexes.reduce(
      (total, index) => total + rowHeights[index],
      0
    )
    return (
      computedHeights +
      Math.floor(defaultHeight * (scrollIndex - computedIndexes.length))
    )
  }

  estimateScrollIndex(scrollTop) {
    const defaultHeight = this.estimateAvgRowHeight()
    let { rowHeights } = this.state

    let currentIndex = 0
    let remainingHeight = scrollTop
    do {
      let rowHeight = rowHeights[currentIndex] || defaultHeight
      if (rowHeight > remainingHeight) {
        return currentIndex
      }
      currentIndex++
      remainingHeight -= rowHeight
    } while (true)
  }

  estimateAvgRowHeight() {
    let heights = Object.values(this.state.rowHeights)
    if (heights.length === 0) return this.props.defaultHeight

    return Math.round(
      heights.reduce((total, height) => total + height, 0) / heights.length
    )
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

Virtue.proptypes = {
  defaultheight: PropTypes.number,
  height: PropTypes.number.isRequired,
  rowRenderer: PropTypes.func.isRequired,
  scrollIndex: PropTypes.number
}

module.exports = Virtue
