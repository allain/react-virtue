const React = require('react')
const Virtue = require('./Virtue')
const render = require('react-test-renderer')

test('renders empty list', () => {
  let tree = render.create(<Virtue rowRenderer={() => <div>Not Called</div>} rowCount={0} height={1000} />)
  expect(tree).toMatchSnapshot()
})

test('renders before section when scrollIndex > 0', () => {
  let tree = render.create(<Virtue scrollIndex={10} rowRenderer={(index) => <div>{index}</div>} rowCount={1000} height={100} defaultHeight={100} />)
  expect(tree).toMatchSnapshot()
})