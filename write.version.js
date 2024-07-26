/**
 * @description: 演示地址自动生成版本号及压缩包
 * @author sundan
 */
const fs = require('node:fs')
const AdmZip = require('adm-zip')
const package = require('./package.json')
const dayjs = require('dayjs')
const zipFilePath = './dist/dist.zip'
const data = {
  version: package.version,
}

fs.writeFile('./public/vue-shop-vite-version.json', `${JSON.stringify(data)}`, (err) => {
  if (err) console.log(`public版本号写入失败！${err.message}`)
  console.log(`dist版本号写入成功！`)
})

fs.writeFile('./dist/vue-shop-vite-version.json', `${JSON.stringify(data)}`, (err) => {
  if (err) console.log(`dist版本号写入失败！${err.message}`)
  console.log(`dist版本号写入成功！`)
})

if (fs.existsSync(zipFilePath)) fs.removeSync(zipFilePath)
const zip = new AdmZip()
zip.addLocalFolder('./dist')
zip.writeZip(zipFilePath)
console.log(`dist压缩成功！`)
const lastBuildTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
console.log(lastBuildTime)
