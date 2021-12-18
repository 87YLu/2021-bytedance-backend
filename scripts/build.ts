import webpack from 'webpack'
import path from 'path'
import fs from 'fs-extra'
const config = require('../webpack.config')

const makePackageJson = () => {
  const packageJSON = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), './package.json'), 'utf-8'),
  )

  delete packageJSON.scripts
  delete packageJSON.devDependencies
  delete packageJSON.mocha

  packageJSON.scripts = {
    start: 'node main.js',
  }

  const file = path.resolve(process.cwd(), './build/package.json')

  fs.writeFileSync(file, JSON.stringify(packageJSON, null, 2), 'utf-8')
}

const copyRecursiveSync = (src: string, dest: string) => {
  fs.copySync(src, dest)

  fs.readdirSync(src)
    .map((name: string) => name)
    .filter((dir: string) => fs.lstatSync(path.join(src, dir)).isDirectory())
    .forEach((dir: string) => {
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

  compiler.run((err: any) => {
    if (err) {
      console.log(err)
      return
    }

    makePackageJson()
    markPublic()

    console.log('success')
  })
})()
