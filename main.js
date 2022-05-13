const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')
const {
  downloadIMAGE,
  getFileList,
  mergeIMAGE,
  getEnv
} = require('./util')

const env = getEnv()
const DIR_NAME = path.join(__dirname, env.dir)

;(async () => {
  const start = Date.parse(new Date())
  const browser = await puppeteer.launch({})
  const page = await browser.newPage()
  await page.setViewport({
    width: 1400,
    height: 768
  })
  await page.goto(env.url)

  await page.evaluate(async () => {
    function sleep(time) {
      return new Promise((resolve) => {
        setTimeout(resolve, time)
      })
    }

    let _PAGE = preview.getPage()
    while (_PAGE.remain > 0) {
      preview.remain()
      _PAGE = preview.getPage()
    }
    await sleep(1000)

    const doms = document.querySelectorAll('.webpreview-item img')
    let count = 0
    while (count < doms.length) {
      const hasSrc =
        doms[count].getAttribute('src') || doms[count].getAttribute('data-src')
      if (hasSrc) {
        count++
        continue
      }
      doms[count].scrollIntoView()
      await sleep(500)
    }
  })

  const imgs = await page.$$eval('.webpreview-item img', (imgs) => {
    return imgs.map(
      (img) =>
        `https:${img.getAttribute('src') || img.getAttribute('data-src')}`
    )
  })

  console.log(
    `共${imgs.length}张图片, 获取到${imgs.filter((o) => o).length}个链接`
  )

  if (!fs.existsSync(DIR_NAME)) {
    fs.mkdirSync(DIR_NAME)
  }

  for (let i = 0; i < imgs.length; i++) {
    const name = (i + 1).toString().padStart(5, '0')
    const result = await downloadIMAGE(
      imgs[i],
      path.join(DIR_NAME, `${name}.png`)
    )

    !result && console.log(`第${name}下载成功!`)
  }

  const files = getFileList(DIR_NAME)

  await mergeIMAGE(
    files.map((o) => `${path.join(DIR_NAME, o)}`),
    path.join(DIR_NAME, env.e_file_name)
  )

  // fs.writeFileSync('./maxbook.json', str, 'utf-8')
  // other actions...
  console.log('end:', Date.parse(new Date()) - start)
  await browser.close()
})()
