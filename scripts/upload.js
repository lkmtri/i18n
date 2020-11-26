#!/usr/bin/env node

const config = require('../utils/config')
const { Lokalise } = require('../utils/lokalise')

const { lokaliseProjectId, lokaliseTokenEnvName = 'LOKALISE_TOKEN', uploadSourcePath } = config.read()

const lokalise = Lokalise({
  apiKey: process.env[lokaliseTokenEnvName],
  projectId: lokaliseProjectId,
})

lokalise.upload({
  path: uploadSourcePath,
})
