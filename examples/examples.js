const React = require('react')
const ReactDOM = require('react-dom')
const Virtue = require('..')

const fixedRow= index => (<div>
  {index + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sodales tellus a venenatis rhoncus. Donec gravida, eros vitae tincidunt fermentum, mi ipsum tincidunt nunc, sed fermentum est ante id neque. Pellentesque ac luctus urna, vel feugiat ipsum. Aliquam at nulla sit amet dui euismod hendrerit. Nam ut leo at augue consectetur mattis vitae a elit. Phasellus varius sagittis nisi rutrum ultrices. Praesent sed felis id nulla fermentum sagittis. Mauris laoreet dui diam, nec iaculis quam tempor in. Nullam consequat, tortor vitae ultrices condimentum, velit ligula hendrerit diam, ac sagittis ligula massa a urna.
</div>)

if (document.getElementById('list-fixed')) {
  ReactDOM.render(
    <Virtue rowCount={500} height={window.innerHeight} scrollIndex={200} rowRenderer={fixedRow}/>,
    document.getElementById('list-fixed')
  )
}



const increasingRow = index => (<div>
  {index + 1}. {Array(2 + index).join('w ')}
</div>)

if (document.getElementById('list-increasing')) {
  ReactDOM.render(
    <Virtue rowCount={500} height={window.innerHeight} scrollIndex={200} rowRenderer={increasingRow}/>,
    document.getElementById('list-increasing')
  )
}

class ExpandableRow extends React.Component {
  constructor() {
    super()
    this.state = {expanded: false}
    this.expand = this.expand.bind(this)
  }

  render() {
    return (this.state.expanded) 
      ? fixedRow(this.props.index)
      : <div><button onClick={this.expand}>Expand {this.props.index}</button></div>
  }

  expand() {
    this.setState({expanded: true})
  }
}

const dynamicRow = index => (<ExpandableRow index={index} />)
if (document.getElementById('list-dynamic')) {
  ReactDOM.render(
    <Virtue rowCount={500} height={window.innerHeight} scrollIndex={200} rowRenderer={dynamicRow}/>,
    document.getElementById('list-dynamic')
  )
}


