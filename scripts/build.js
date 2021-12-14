const webpack = require('webpack')
const config = require('../webpack.config')
const path = require('path')
const fs = require('fs-extra')

const makePackageJson = () => {
  const packageJSON = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), './package.json'), 'utf-8'),
  )

  delete packageJSON.scripts
  delete packageJSON.devDependencies

  packageJSON.scripts = {
    start: 'node main.js',
  }

  const file = path.resolve(process.cwd(), './build/package.json')

  fs.writeFileSync(file, JSON.stringify(packageJSON, null, 2), 'utf-8')
}

const copyRecursiveSync = (src, dest) => {
  fs.copySync(src, dest)

  fs.readdirSync(src)
    .map(name => name)
    .filter(dir => fs.lstatSync(path.join(src, dir)).isDirectory())
    .forEach(dir => {
      copyRecursiveSync(path.join(src, dir), path.join(dest, dir))
    })
}

const markPublic = () => {
  const from = path.join(process.cwd(), './public')
  const to = path.join(process.cwd(), './build/public')
  fs.mkdirSync(to)
  copyRecursiveSync(from, to)
}

;(() => {
  const compiler = webpack(config)

  compiler.run(err => {
    if (err) {
      console.log(err)
      return
    }

    makePackageJson()
    markPublic()

    console.log('success')
  })
})()
