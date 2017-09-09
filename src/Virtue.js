const React = require('react')
const PropTypes = require('prop-types')
const ReactHeight = require('react-height')

class Virtue extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      scrollIndex: props.scrollIndex || 0,
      rowInfo: {}
    }
  }

  componentDidMount() {
    setTimeout(() => {
      let heightBefore = this.estimateHeightBefore(this.state.scrollIndex)
      this.list.scrollTop = heightBefore
      this.listenScrollEvent()
    }, 25)

    this.list.addEventListener('scroll', this.listenScrollEvent.bind(this))
  }

  componentWillUnmount() {
    this.list.removeEventListener('scroll', this.listenScrollEvent.bind(this))
  }

  listenScrollEvent(event) {
    let scrollIndex = this.estimateScrollIndex(this.list.scrollTop)

    if (scrollIndex !== this.state.scrollIndex) {
      this.setState(oldState => ({ ...oldState, scrollIndex }))
    }
  }

  render() {
    const {
      rowCount,
      rowRenderer,
      height,
      style = {},
      ...otherProps
    } = this.props
    const { scrollIndex } = this.state

    delete otherProps.scrollIndex
    delete otherProps.defaultHeight

    style.height = height + 'px'
    style.overflowY = 'scroll'

    let heightBefore = this.estimateHeightBefore(scrollIndex)
    let heightAfter = this.estimateHeightAfter(scrollIndex)

    const before = heightBefore ? (
      <div key="before" style={{ height: heightBefore }} />
    ) : null
    const after = heightAfter ? (
      <div key="after" style={{ height: heightAfter }} />
    ) : null

    const rows = []
    for (let i = scrollIndex; i < scrollIndex + 20; i++) {
      rows.push(this.renderRow(i))
    }

    return (
      <div ref={list => (this.list = list)} {...otherProps} style={style}>
        {before}
        {rows}
        {after}
      </div>
    )
  }

  estimateHeightBefore(scrollIndex) {
    const defaultHeight = this.estimateAvgRowHeight()
    if (scrollIndex === 0) return 0

    let { rowInfo } = this.state

    let computedIndexes = Object.keys(rowInfo).filter(i => i < scrollIndex)
    let computedHeights = computedIndexes.reduce(
      (total, index) => total + rowInfo[index].height,
      0
    )
    return (
      computedHeights + defaultHeight * (scrollIndex - computedIndexes.length)
    )
  }

  estimateScrollIndex(scrollTop) {
    const defaultHeight = this.estimateAvgRowHeight()
    let { rowInfo } = this.state

    let currentIndex = 0
    let remainingHeight = scrollTop
    do {
      let currentRowInfo = rowInfo[currentIndex]
      let rowHeight = currentRowInfo ? currentRowInfo.height : defaultHeight
      if (rowHeight > remainingHeight) {
        return currentIndex
      }
      currentIndex++
      remainingHeight -= rowHeight
    } while (true)
  }

  estimateAvgRowHeight() {
    let heights = Object.values(this.state.rowInfo).map(i => i.height)
    if (heights.length === 0) return this.props.defaultHeight

    return Math.round(
      heights.reduce((total, height) => total + height, 0) / heights.length
    )
  }

  estimateHeightAfter(scrollIndex) {
    let { rowInfo } = this.state

    const defaultHeight = this.estimateAvgRowHeight()

    let computedIndexes = Object.keys(rowInfo).filter(i => i > scrollIndex)
    let computedHeights = computedIndexes.reduce(
      (total, index) => total + rowInfo[index].height,
      0
    )
    return (
      computedHeights +
      defaultHeight *
        (this.props.rowCount - scrollIndex - computedIndexes.length)
    )
  }

  renderRow(index) {
    const { rowRenderer } = this.props

    return (
      <ReactHeight
        key={`row-${index}`}
        onHeightReady={height => this._updateRowHeight(index, height)}>
        {rowRenderer(index)}
      </ReactHeight>
    )
  }

  _updateRowHeight(index, height) {
    this.setState(oldState => ({
      ...oldState,
      rowInfo: {
        ...oldState.rowInfo,
        [index]: { ...(oldState.rowInfo[index] || {}), height }
      }
    }))
  }
}

Virtue.proptypes = {
  defaultheight: PropTypes.number,
  height: PropTypes.number.isRequired,
  rowRenderer: PropTypes.func.isRequired,
  scrollIndex: PropTypes.number
}

module.exports = Virtue
