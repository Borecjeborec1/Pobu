const { compile } = require('nexe')

compile({
  input: '../index.js',
  output: './app/pobu',
  build: true

}).then(() => {
  console.log('success')
})
// pkg index.js --targets node16-win-x64 --out-path ./app/pobu.exe