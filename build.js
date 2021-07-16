const Static = require('./lib')

const {
  markdown,
  permalink,
  layout,
  codeHighlight,
  collections,
  tags,
  pcss
} = require('./plugins')

const app = Static(__dirname)

app.use([
  markdown(),
  permalink(),
  tags(),
  codeHighlight(),
  collections(),
  layout(),
  pcss()
])

app.build(err => {
  if (err) {
    console.log('err', err)
  }
  console.log('done')
})