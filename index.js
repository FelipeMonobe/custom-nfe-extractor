const _parseString = require('xml2js').parseString
const _readFile = require('graceful-fs').readFile
const Spinner = require('cli-spinner').Spinner
const inquirer = require('inquirer')
const _glob = require('glob')
const R = require('ramda')
const Q = require('q')

const parseString = Q.denodeify(_parseString)
const readFile = Q.denodeify(_readFile)
const glob = Q.denodeify(_glob)

const main = async () => {
  const prompt = inquirer.createPromptModule()
  const askRawBasePath = async () => prompt({ name: 'rawBasePath', message: 'Full base path to scan: ', default: '/home/amonobeax/Documentos/Profissional/Hidrogood/Cd XML HIDROGOOD' })
  const {rawBasePath} = await askRawBasePath()
  const spinner = new Spinner('%s Scanning XMLs...')
  
  spinner.setSpinnerString(12)
  spinner.start()
  
  const basePath = rawBasePath.trim().replace(/\s/, '\ ')
  const filesPattern = '**/*.xml'
  const filesPath = await glob(filesPattern, { cwd: basePath })
  const filesContent = await Q.all(filesPath.map(filePath =>
    readFile(`${basePath}/${filePath}`, 'utf-8')))
  const parserOptions = {
    explicitArray: false,
    trim: true,
  }
  const xmls = await Q.allSettled(filesContent.map(fileContent =>
    parseString(fileContent, parserOptions)))
  const parsedXmls = xmls.filter(xml => xml.state == 'fulfilled')
  const groupedByTypes = R.groupBy(x => Object.keys(x.value)[0], parsedXmls)
  const types = Object.keys(groupedByTypes)
  .map(t => ({ name: `${t} (${groupedByTypes[t].length})`, value: t }))
  
  spinner.stop()
  
  const askXmlType = async () => prompt({ type: 'list', name: 'type', message: 'Select XML type: ', choices: types })
  const type = await askXmlType()
  
  const deepPrint = (node, path = 'obj') => {
    const recurseChildren = R.map(prop => {
      if (typeof node[prop] !== 'object') return `${path}.${prop}`
      return deepPrint(node[prop], `${path}.${prop}`)
    })
  
    return R.pipe(R.keys, recurseChildren, R.flatten)(node)
  }
    
  const chosenTypeXmls = parsedXmls
    .filter(xml => xml.value.hasOwnProperty(type))
  const xmlProps = deepPrint(chosenTypeXmls[0][type])
  console.log(xmlProps)  
  
/*    
    .map(xml => {    
      const product = xml.value.hasOwnProperty('NFe') ?
        Array.isArray(xml.value.NFe.infNFe.det) ? 
          xml.value.NFe.infNFe.det[0].prod :
          xml.value.NFe.infNFe.det.prod :
        Array.isArray(xml.value.nfeProc.NFe.infNFe.det) ?
          xml.value.nfeProc.NFe.infNFe.det[0].prod :
          xml.value.nfeProc.NFe.infNFe.det.prod

      return {
        NCM: product.NCM,
        IPI: product.vUnTrib,
        valor: product.vProd,
        descricao: product.xProd,
      }
    })*/
}

main()
