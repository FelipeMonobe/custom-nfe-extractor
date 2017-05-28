const Spinner = require('cli-spinner').Spinner
const inquirer = require('inquirer')

let _spinner
const pageSize = 30
const _makeSpinner = () => {
  _spinner = new Spinner('%s Processing, please wait...')
  _spinner.setSpinnerString(12)
  return _spinner
}
const toggleSpinner = (msg) => {
  if (!_spinner) _makeSpinner()
  if (_spinner.isSpinning()) return _spinner.stop()
  return _spinner.start()
}

const _prompt = inquirer.createPromptModule()
const askPath = () => _prompt({
  name: 'selectedPath',
  message: 'Path to scan: ',
  default: '/home/amonobeax/Documentos/Profissional/Hidrogood/Cd XML HIDROGOOD',
})
const askXmlType = (types) => _prompt({
  name: 'selectedType',
  type: 'list',
  message: 'XML types: ',
  pageSize,
  choices: types,
})
const askXmlProps = (xmlProps) => _prompt({
  name: 'selectedProps',
  type: 'checkbox',
  message: 'XML properties: ',
  pageSize,
  choices: xmlProps,
})
const askProcessing = () => _prompt({
  name: 'willProcess',
  type: 'confirm',
  message: 'Process data? '
})
const askConsolidate = (selectedProps) => _prompt({
  name: 'selectedConsolidatees',
  type: 'checkbox',
  message: 'Properties to consolidate: ',
  pageSize,
  choices: selectedProps
})

module.exports = {
  askPath,
  askXmlType,
  askXmlProps,
  askProcessing,
  askConsolidate,
  toggleSpinner,
}
