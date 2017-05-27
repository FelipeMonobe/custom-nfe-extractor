const utilService = require('./src/util.service')
const fileService = require('./src/file.service')
const cliService = require('./src/cli.service')
const xmlService = require('./src/xml.service')
const { keys, map } = require('ramda')

const main = async () => {
  const { selectedPath } = await cliService.askPath()

  cliService.toggleSpinner()

  const rawXmls = await fileService.readXmlFrom(selectedPath)
  const xmls = await xmlService.parseToXml(rawXmls)
  const xmlGroupedByTypes = utilService.groupByTypes(xmls)
  const typesKeys = keys(xmlGroupedByTypes)
  const types = map(t => ({ name: `${t} (${xmlGroupedByTypes[t].length})`, value: t }), typesKeys)

  cliService.toggleSpinner()

  const { selectedType } = await cliService.askXmlType(types)
  const xmlFilteredByType = utilService.filterByXmlType(selectedType)(xmls)
  const sampleXml = xmlFilteredByType[0].value[selectedType]
  const xmlProps = utilService.getDeepProps(sampleXml, selectedType)
  const { selectedProps } = await cliService.askXmlProps(xmlProps)
}

main()
