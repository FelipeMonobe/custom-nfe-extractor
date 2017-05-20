const _parseString = require('xml2js').parseString
const _readFile = require('graceful-fs').readFile
const _glob = require('glob')
const Q = require('q')

const parseString = Q.denodeify(_parseString)
const readFile = Q.denodeify(_readFile)
const glob = Q.denodeify(_glob)

const main = async () => {
  const basePath = '/home/amonobeax/Documentos/Profissional/Hidrogood/Cd\ XML\ HIDROGOOD'
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
    
  const res = xmls
    .filter(xml => xml.state == 'fulfilled')
    .filter(xml => !xml.value.hasOwnProperty('NFe'))
    .filter(xml => !xml.value.hasOwnProperty('cteProc'))
    .filter(xml => !xml.value.hasOwnProperty('procEventoNFe'))
    .filter(xml => !xml.value.hasOwnProperty('protNFe'))
    .filter(xml => !xml.value.hasOwnProperty('inutNFe'))
    .filter(xml => !xml.value.hasOwnProperty('retInutNFe'))
    .filter(xml => !xml.value.hasOwnProperty('retConsReciNFe'))
    .filter(xml => !xml.value.hasOwnProperty('nm:nfeProc'))
    .filter(xml => !xml.value.hasOwnProperty('NFES'))
    .filter(xml => !xml.value.hasOwnProperty('procCancNFe'))
    .filter(xml => !xml.value.hasOwnProperty('procCancNF'))
    .map(xml => {    
      const product = xml.value.hasOwnProperty('NFe') ?
        xml.value.NFe.infNFe.det.prod : 
        xml.value.nfeProc.NFe.infNFe.det.prod
        
        return {
          NCM: product.NCM,
          IPI: product.vUnTrib,
          valor: product.vProd,
          descricao: product.xProd,
        }
    })
}

main()
