const { prepend } = require('ramda')
const xlsx = require('node-xlsx')

const buildXlsx = (name, header, body) => {
  const data = _prependHeaders(header, body)
  return xlsx.build([{ name, data }])
}
const _prependHeaders = (props, data) => prepend(props, data)

module.exports = {
  buildXlsx
}
