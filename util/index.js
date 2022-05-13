const gm = require('gm')
const path = require('path')
const fs = require('fs')
const axios = require('axios')

async function mergeIMAGE(files, fileName) {
  const [first, ...remains] = files
  return new Promise((resolve) => {
    const g = gm(first)
    for (const img of remains) {
      g.append(img)
    }
    g.write(fileName, (err) => {
      err && console.log(err)
      resolve()
    })
  })
}

function getFileList(dir, mimes) {
  const fileList = fs.readdirSync(dir)

  return fileList.filter((o) => {
    if (!mimes) return true

    for (const mime of mimes) {
      const str = o.substr(-mime.length)
      if (str === mime) return true
    }
  })
}

function downloadIMAGE(url, fileName) {
  return axios({ url, responseType: 'stream' }).then((response) => {
    return new Promise((resolve, reject) => {
      response.data
        .pipe(fs.createWriteStream(fileName))
        .on('finish', () => resolve())
        .on('error', (e) => reject(e))
    })
  })
}

function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

function getEnv() {
  const args = process.argv.slice(2)
  const env = {}

  args.forEach((o) => {
    const [name, value] = o.split('=')
    env[name] = value
  })
  return env
}

module.exports = {
  mergeIMAGE,
  getFileList,
  downloadIMAGE,
  sleep,
  getEnv
}
