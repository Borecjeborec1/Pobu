const pobu = require('./lib/pobu.js')
const fs = require('fs')
const gkm = require('gkm');

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
    return data.toString().trim()
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
    if (lines[i].startsWith("//"))
      lines.splice(i, 1)
    lines[i] = lines[i].trim()
    if (!lines[i]) { // enters
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
  for (let i = 0; i < parsed.length; ++i) {
    let block = parsed[i]
    if (block[0].startsWith("on")) {
      let events = block[0].split(" ")
      let event = events[1]
      let eventButton = events[2]
      let doables = block.slice(1, block.length)
      switch (event) {
        case "start":
          simulate(doables)
          break;
        case "press":
          gkm.events.on("key.pressed", (key) => {
            if (key == eventButton)
              simulate(doables)
          })
          break;
        case "release":
          gkm.events.on("key.released", (key) => {
            if (key == eventButton)
              simulate(doables)
          })
          break;
        case "write":
          let clickedHotkeys = ""
          gkm.events.on("key.pressed", (key) => {
            if (key.length == 1)
              clickedHotkeys += key
            if (clickedHotkeys.includes(eventButton)) {
              clickedHotkeys = ""
              simulate(doables)
            }
          })
          break;
        case "click":
          gkm.events.on("mouse.click", () => {
            simulate(doables)
          })
          break;
        // case "doubleClick":
        //   gkm.events.on("mouseDoubleClick", () => {
        //     simulate(doables)
        //   })
      }
    }
  }
}

async function simulate(codeBlock) {
  for (let i = 0; i < codeBlock.length; ++i) {
    let multiplier = codeBlock[i].match(/ x\d+/) != null ? codeBlock[i].match(/ x\d+/)[0].replace("x", "") : 1
    codeBlock = codeBlock[i].match(/ x\d+/) != null ? [codeBlock[i].replace(/ x\d+/, "")] : codeBlock
    for (let j = 0; j < multiplier; ++j) {
      let codes = codeBlock[i].split(" ")
      switch (codes[0]) {
        case "press":
          pobu.keyTap(codes[1])
          break
        case "write":
          for (let m = 1; m < codes.length; ++m) {
            pobu.write(codes[m].split(""))
          }
          break
        case "click":
          pobu.mouseClick()
          break
        case "move":
          if (codes[1] == "relative") {
            pobu.mouseMove(+codes[2], +codes[3], false)
          } else {
            pobu.mouseMove(+codes[1], +codes[2])
          }
          break
        case "sleep":
        case "wait":
          await sleep(codes[1])
          break
      }
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}