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

const collections = () => 
(files, context, done) => {

    context.collections = {}

    Object.entries(files).forEach(([key, file]) => {
      const { collection } = file
      if (collection) {
        if (!context.collections[collection]) {
          context.collections[collection] = []
        }
        context.collections[collection].push(files[key])
      }
    })

    Object.entries(context.collections)
      .forEach(([collection, items]) => {
        const sorted = items.sort(sortFn)
          .map((item, index, array) => {
            const prev = array[index - 1]
            const next = array[index + 1]
            return {
              ...item,
              next: next ? next : array[0],
              prev: prev ? prev : array[array.length - 1],
            }
          })

        context.collections[collection] = sorted
      })
      
    done()
  }

module.exports = collections