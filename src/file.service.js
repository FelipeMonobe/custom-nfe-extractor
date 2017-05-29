const fs = require('graceful-fs')
const { map } = require('ramda')
const _glob = require('glob')
const Q = require('q')

const writeFile = Q.denodeify(fs.writeFile)
const readFile = Q.denodeify(fs.readFile)
const glob = Q.denodeify(_glob)

const _getXmlPaths = (cwd, selectedGlob) => glob(selectedGlob, { cwd })
const _readXmlContent = (cwd, xmlPaths) => Q
  .all(map(xmlPath => readFile(`${cwd}/${xmlPath}`, 'utf-8'), xmlPaths))

const readXmlFrom = async (rootPath, selectedGlob) => {
  const cwd = rootPath.trim().replace(/\s/, '\ ')
  const xmlPaths = await _getXmlPaths(cwd, selectedGlob)
  const xmlContent = await _readXmlContent(cwd, xmlPaths)
  return xmlContent
}

const saveXlsx = (fileName, savePath, xlsxBuffer) => {
  return writeFile(fileName, xlsxBuffer)
}

module.exports = {
  readXmlFrom,
  saveXlsx
}
