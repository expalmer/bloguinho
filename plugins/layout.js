const path = require('path')
const ejs = require('ejs')
const isUtf8 = require('is-utf8')
const multimatch = require('multimatch')

const layout = () => 
  (files, context , done) => {
    const promises = multimatch(Object.keys(files), "**/*.html")
      .filter(key => files[key].template && isUtf8(files[key].contents))
      .map(key => new Promise(resolve => {
          const file = files[key]
          ejs.renderFile(path.resolve(`templates/${file.template}`), { ...context, ...file }, (err, str) => {
            if (err) {
              throw err
            }
            files[key].contents = Buffer.from(str)
            resolve()
          })  
        })
      )

    Promise.all(promises)
      .then(done)
  }

module.exports = layout