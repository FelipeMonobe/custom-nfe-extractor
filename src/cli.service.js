const Spinner = require('cli-spinner').Spinner
const inquirer = require('inquirer')

let _spinner
const _makeSpinner = () => {
  _spinner = new Spinner('%s Scanning XMLs...')
  _spinner.setSpinnerString(12)
  return _spinner
}
const toggleSpinner = () => {
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
  choices: types,
})
const askXmlProps = (xmlProps) => _prompt({
  name: 'selectedProps',
  type: 'checkbox',
  message: 'XML properties: ',
  choices: xmlProps,
})

module.exports = {
  askPath,
  askXmlType,
  askXmlProps,
  toggleSpinner,
}
