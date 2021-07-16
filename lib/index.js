const fs = require('fs-extra')
const path = require('path')
const rm = require('rimraf')
const matter = require('gray-matter')
const readdir = require('recursive-readdir')
const isUtf8 = require('is-utf8')
const Mode = require('stat-mode')

const plugins = []
const opts = {
  source: 'src',
  dest: 'build'
}

const metadata = {}

const clean = (dest) => new Promise(resolve => {
  rm(path.join(dest, '*'), { glob: { dot: true } }, resolve)
})

const readFile = (file) => new Promise(resolve => fs.readFile(file, (err, x) => resolve(x)))
const getStat = (file) => new Promise(resolve => fs.stat(file, (err, x) => resolve(x)))

const fill = async (file) => {
  const [buffer, stats] = await Promise.all([readFile(file), getStat(file)])

  let data = {}
  let contents = buffer

  if (isUtf8(buffer)) {
    const parsed = matter(buffer.toString())
    data = parsed.data
    contents = Buffer.from(parsed.content)
  }

  const correctPath = file.replace(/^src\//, '')
  return {
    [correctPath]: {  
      ...data,
      mode: Mode(stats).toOctal(),
      stats,
      contents,
    }
  }  
}

const writing = ([file, data]) => new Promise(resolve => {
  const filePath = path.resolve(opts.dest, file)
  fs.outputFile(filePath, data.contents, resolve)
})

const write = async(files) => {
  const promises = Object.entries(files).map(writing)
  await Promise.all(promises)
  return
}

const read = async() => {
  const paths = await readdir(opts.source)
  const files = (await Promise.all(paths.map(fill)))
    .reduce((acc, x) => ({...acc, ...x }), {})

  return files
}

const middlewares = files => new Promise(resolve => {
  let index = 0
  function next(err) {
    const plugin = plugins[index++]
    if (!plugin) {
      resolve()
      return
    }
    plugin(files, metadata, next)
  }
  next()
})

function metalsmith() {  
  const build = async() => {
    console.time('build in')
    await clean(opts.dest)
    const files = await read()
    await middlewares(files)
    await write(files)
    console.timeEnd('build in')
  }

  const use = (fns) => fns.map(fn => plugins.push(fn))

  return {
    use,
    build
  }
}

module.exports = metalsmith