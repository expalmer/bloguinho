const slugify = require('slugify')

const slug = x => slugify(x, { lower: true })

const permalink = () => 
  (files, context, done) => {    
    Object.entries(files)
      .forEach(([key, file]) => {

        if (!file.title) return
  
        const newKey = `${slug(file.title)}/index.html`

        files[newKey] = { slug: newKey, ...file }

        delete files[key]

      })    
    done()
  }
  
module.exports = permalink