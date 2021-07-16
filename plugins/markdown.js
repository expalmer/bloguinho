const marked = require('marked')
const { dirname, basename, extname, join } = require('path')

const isMarkdown = (x) => /\.md$|\.markdown$/.test(extname(x))

const markdown = () => 
  (files, metalsmith, done) => {
    
    Object.entries(files).forEach(([file, val]) => {
      if (!(isMarkdown(file))) {
        return
      }
  
      const contents = marked(files[file].contents.toString(), {})

      const nextFile = { 
        ...files[file],
        contents: Buffer.from(contents)
       };

      delete files[file];

      const dir = dirname(file) || ''
      const key = join(dir, `${basename(file, extname(file))}.html`)
      
      files[key] = nextFile

    })

    done()
  }
  
module.exports = markdown