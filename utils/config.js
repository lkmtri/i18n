const path = require('path')
const { readJSONSync } = require('fs-extra')

module.exports.read = (filename = 'i18n.config.json') => readJSONSync(
  path.resolve(process.cwd(), filename)
)
