const examplesMap = {
  'list-fixed': require('./list-fixed'),
  'list-dynamic': require('./list-dynamic'),
  'list-increasing': require('./list-increasing'),
  'list-random': require('./list-random')
}

Object.keys(examplesMap).forEach(id => {
  if (document.getElementById(id)) {
    examplesMap[id]() // run example
  }
})
