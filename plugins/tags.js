const defaultField = 'date'

const sortFn = (a, b) => {
  a = a[defaultField];
  b = b[defaultField];
  if (!a && !b) return 0;
  if (!a) return -1;
  if (!b) return 1;
  if (b > a) return -1;
  if (a > b) return 1;
  return 0;
}

const tags = () => 
  (files, context, done) => {
    
    const obj = {}
    context.tags = []

    Object.entries(files)
      .forEach(([key, file]) => {
        if(file.tags) {
          const arrayOfTags = file.tags.trim().split(' ')
          files[key].tags = arrayOfTags
          files[key].tags
            .forEach(tag => {
              if (!obj[tag]) obj[tag] = []
              obj[tag].push(files[key])
            })
        }
        
      })
    
    const tags = [];

    Object.entries(obj).forEach(([tag, items]) => {

      const sorted = items.sort(sortFn)

      files[`${tag}/index.html`] = {
        tag,
        contents: '',
        items: sorted,
        template: 'tag.ejs'
      }

      tags.push({
        name: tag,
        total: items.length
      })

    })

    files['tags/index.html'] = {
      template: 'tags.ejs',
      contents: '',
      tags
    }
    
    done()
  }
  
module.exports = tags