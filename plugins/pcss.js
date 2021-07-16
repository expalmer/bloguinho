const autoprefixer = require('autoprefixer')
const postcss = require('postcss')
const precss = require('precss')
const cssnano = require('cssnano')
const multimatch = require('multimatch')

const pcss = () => 
  (files, context , done) => {
    const [key]= multimatch(Object.keys(files), "**/*.css")
    // cssnano
    postcss([precss, autoprefixer])
      .process(files[key].contents, { from: key })
      .then(result => {
        files[key].contents = Buffer.from(result.css)
        done()
      })
      .catch(err => {
        throw err
      })    
  }

module.exports = pcss