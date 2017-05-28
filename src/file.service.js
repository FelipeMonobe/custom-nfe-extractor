const _readFile = require('graceful-fs').readFile
const { map } = require('ramda')
const _glob = require('glob')
const Q = require('q')

const readFile = Q.denodeify(_readFile)
const glob = Q.denodeify(_glob)

const _getXmlPaths = (cwd, selectedGlob) => glob(selectedGlob, { cwd })
const _readXmlContent = (cwd, xmlPaths) => Q
  .all(map(xmlPath => readFile(`${cwd}/${xmlPath}`, 'utf-8'), xmlPaths))

const readXmlFrom = async (rootPath, selectedGlob) => {
  const cwd = rootPath.trim().replace(/\s/, '\ ')
  const xmlPaths = await _getXmlPaths(cwd, selectedGlob)
  return await _readXmlContent(cwd, xmlPaths)
}

module.exports = {
  readXmlFrom,
}
