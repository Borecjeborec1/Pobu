const pobu = require('./lib/pobu.js')
const fs = require('fs')

let args = process.argv.slice(2)
if (args.length < 1) {
  console.log(`Usage: pobu <file> [options]
For more information, use --help or -h option`)
  process.exit(1)
}
main()

function main() {
  let utfString = read(args[0])
  if (!utfString) return false
  let parsed = parse(utfString)
  if (!parsed) return false
  interpret(parsed)
}

function read(filePath) {
  if (fs.existsSync(filePath)) {
    let data = fs.readFileSync(filePath, 'utf8')
    return data.toString()
  } else {
    console.log(`File ${filePath} not found.
  Searched in: ${process.cwd()}
  Looked for: ${process.cwd()}/${filePath}
  Please check your file path and try again.`)
    process.exit(1)
  }

}

function parse(content) {
  let lines = content.split("\r\n")
  let parsedLines = []
  for (let i = lines.length - 1; i >= 0; --i) {
    lines[i] = lines[i].trim()
    if (!lines[i]) {
      lines[i] = "block end"
    }
    if ("block end".indexOf(lines[i]) !== -1) {
      let block = lines.slice(i + 1, lines.length)
      if (!block.length) break
      parsedLines.unshift(lines.splice(i + 1, lines.length - i));
      lines.pop();
    }
  }
  parsedLines.unshift(lines)
  return parsedLines
}

function interpret(parsed) {
  console.log(parsed)
}
