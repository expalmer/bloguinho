// const Prism = require('prismjs');
// const loadLanguages = require('prismjs/components/');
// loadLanguages(['javascript']);

// // The code snippet you want to highlight, as a string
// const code = `= ['hi', 'there', 'reader!'].join " "`;

// // Returns a highlighted HTML string
// const html = Prism.highlight(code, Prism.languages.haml, 'haml');

// console.log(html)

const codeHighlight = () =>
  (files, context, done) => {
    // Object.entries(files)
    //   .forEach(([key, val]) => {
    //     if (val.template === 'article.ejs') {
    //       // console.log(val.contents.toString())
    //       const html = Prism.highlight("", Prism.languages.javascript, 'javascript');
    //       // console.log(html)
    //       // files[key].contents = Buffer.from(html)
    //     }
    //   })

    done()
  }

module.exports = codeHighlight