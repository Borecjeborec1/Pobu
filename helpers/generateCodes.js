const fs = require("fs")
let data = fs.readFileSync("helpers/codes.txt", "utf8")
let obj = {}
data.split("\r\n").forEach(el => obj[el.trim().split(" ")[0]] = +el.trim().split(" ")[1])
console.log(obj)