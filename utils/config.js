const path = require('path')
const convict = require('convict')

convict.addFormat({
  name: 'array-string',
  validate: (v) => Array.isArray(v) && !v.find(x => !typeof x === 'string')
})

const config = convict({
  lokaliseProjectId: {
    format: String,
    default: null,
  },
  lokaliseTokenEnvName: {
    format: String,
    default: 'LOKALISE_TOKEN',
  },
  downloadDestinationPath: {
    format: String,
    default: null,
  },
  uploadSourcePath: {
    format: String,
    default: '',
  },
  extractOutputFile: {
    format: String,
    default: null,
  },
  extractPaths: {
    format: 'array-string',
    default: ['./src']
  },
  ignoredPaths: {
    format: 'array-string',
    default: ['./**/tests']
  }
})

module.exports.read = (filename = 'i18n.config.json') => {
  const file = path.resolve(process.cwd(), filename)
  config.loadFile(file).validate()
  return config.getProperties()
}
