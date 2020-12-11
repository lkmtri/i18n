#!/usr/bin/env node

const { outputFile } = require('fs-extra')
const { extract } = require('@formatjs/cli')
const { sync: globSync } = require('fast-glob')
const config = require('../utils/config')

const { extractPaths, ignoredPaths, extractOutputFile } = config.read()

const files = globSync(extractPaths, {
  ignore: ignoredPaths,
})

const extractMessage = async () => {
  try {
    const messages = JSON.parse(
      await extract(files, {
        idInterpolationPattern: '[sha512:contenthash:base64:6]',
        additionalComponentNames: ['T'],
        extractFromFormatMessageCall: true,
      })
    )

    const parsed = Object.keys(messages).reduce((acc, key) => {
      acc[key] = messages[key].defaultMessage || ''
      return acc
    }, {})

    await outputFile(extractOutputFile, JSON.stringify(parsed, null, 2), 'utf-8')
  } catch (err) {
    console.error(err.message)
  }
}

extractMessage()
