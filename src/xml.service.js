const _parseString = require('xml2js').parseString
const { filter, map } = require('ramda')
const Q = require('q')

const parseString = Q.denodeify(_parseString)

const _parserOptions = { explicitArray: false, trim: true }
const parseToXml = async (content) => {
  if (typeof content === 'string') {
    return parseString(content, _parserOptions)
  }

  const xmls = await Q.allSettled(map(c => parseString(c, _parserOptions), content))
  return filter(x => x.state === 'fulfilled', xmls)
}

module.exports = {
  parseToXml
}
