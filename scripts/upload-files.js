const FileUploader  = require('upyun-file-uploader-tool-nodejs')
const path = require('path')
const { UPYUN_USER, UPYUN_PWD } = require('dotenv').config().parsed

const pkgJson = require('../package.json')

const fileUploader = new FileUploader('dby-page')

async function task() {
  const dir = path.resolve(process.cwd(), `./build/release`)
  const fileNames = ['index.html', 'index.js', 'static/**/*']

  fileUploader.login(UPYUN_USER, UPYUN_PWD)
  await fileUploader.upload(dir, `paas-demo-web/${pkgJson.version}`, fileNames)
}

task().catch((e) => {
  console.log(e)
  process.exit(-1)
})
