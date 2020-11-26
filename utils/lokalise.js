/* istanbul ignore file */
const path = require('path')
const { Buffer } = require('buffer')
const request = require('request')
const unzipper = require('unzipper')
const { LokaliseApi } = require('@lokalise/node-api')
const { readJSON } = require('fs-extra')

module.exports.Lokalise = ({ apiKey, projectId: project_id }) => {
  const lokaliseApi = new LokaliseApi({ apiKey })

  const listLanguages = async () => {
    const languages = await lokaliseApi.languages.list({ project_id })
    return languages
  }

  const listLanguageIsos = async () => {
    const languages = await listLanguages()

    return languages.map((lang) => lang.lang_iso)
  }

  const upload = async ({ langIso = 'en', path } = {}) => {
    const json = await readJSON(path)
    const data = Buffer.from(JSON.stringify(json)).toString('base64')
    const process = await lokaliseApi.files.upload(project_id, {
      data,
      filename: path,
      lang_iso: langIso,
      replace_modified: false,
    })

    return lokaliseApi.queuedProcesses.get(process.process_id, { project_id })
  }

  const download = async ({ path: dest }) => {
    const resp = await lokaliseApi.files.download(project_id, {
      format: 'json',
      original_filenames: false,
      json_unescaped_slashes: true,
      placeholder_format: 'icu',
      replace_breaks: false,
    })

    const directory = await unzipper.Open.url(request, resp.bundle_url)

    await directory.extract({
      path: path.resolve(process.cwd(), dest),
    })
  }

  return {
    listLanguages,
    listLanguageIsos,
    upload,
    download,
  }
}
