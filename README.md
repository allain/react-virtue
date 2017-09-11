# react-virtue

**react-virtue** is a virtualized list for React. It has far fewer bells and whistles than [react-virtualized](https://npmjs/package/react-virtualized), so if you feel like this is limited better look there.

## Installation

```bash
npm install react-virtue
```

## Usage

```js
const React = require('react')
const ReactDOM = require('react-dom')

const Virtue = require('..')

function renderRow(index) {
  // Return any DOM element here
  return <div>{index}</div>
}

ReactDOM.render(
  <Virtue
    rowCount={50000}
    height={300}
    rowRenderer={renderRow}
    startIndex={100 /* Defaults to 0 */}
  />,
  document.getElementById('app')
)
```