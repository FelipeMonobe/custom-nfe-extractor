const { filter, flatten, groupBy, keys, map, pipe } = require('ramda')

const groupByTypes = groupBy(x => keys(x.value)[0])
const filterByXmlType = type => filter(x => x.value.hasOwnProperty(type))
const getDeepProps = (node, path = 'obj') => {
  const recurseChildren = map(prop => {
    if (typeof node[prop] !== 'object') return `${path}.${prop}`
    return getDeepProps(node[prop], `${path}.${prop}`)
  })

  return pipe(keys, recurseChildren, flatten)(node)
}

module.exports = {
  filterByXmlType,
  getDeepProps,
  groupByTypes
}
