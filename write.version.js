const fs = require('fs')
const package = require('./package.json')
const data = {
  version: package.version,
}

fs.writeFile('./dist/vue-shop-vite-version.json', `${JSON.stringify(data)}`, (err) => {
  if (err) console.log(`版本号写入失败！${err.message}`)
  console.log(`版本号写入成功！`)
})

fs.writeFile('./public/vue-shop-vite-version.json', `${JSON.stringify(data)}`, (err) => {
  if (err) console.log(`版本号写入失败！${err.message}`)
  console.log(`版本号写入成功！`)
})
