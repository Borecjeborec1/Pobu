const pobu = require('bindings')('pobu.node')
const SCAN_CODES = {
  "ESC": 1,
  "BACKSPACE": 14,
  "TAB": 15,
  "ENTER": 28,
  "CTRL": 29,
  "SHIFT": 42,
  "ALT": 56,
  "SPACE": 57,
  "CAPS_LOCK": 58,
  "F1": 59,
  "F2": 60,
  "F3": 61,
  "F4": 62,
  "F5": 63,
  "F6": 64,
  "F7": 65,
  "F8": 66,
  "F9": 67,
  "F10": 68,
  "F11": 87,
  "F12": 88,
  "NUM_LOCK": 69,
  "SCROLL_LOCK": 70,
  "HOME": 71,
  "UP": 72,
  "PAGE_UP": 73,
  "LEFT": 75,
  "RIGHT": 77,
  "DOWN": 80,
  "PAGE_DOWN": 81,
  "INSERT": 82,
  "DELETE": 83,
}
function keyTap(key) {
  if (key.length == 1)
    return pobu.keyTap(key.toUpperCase())

  if (SCAN_CODES[key])
    return pobu.keyTap(SCAN_CODES[key])
}
function write(keys) {
  for (let key of keys) {
    keyTap(key)
  }
}
function mouseMove(dx, dy, absolute = true) {
  pobu.mouseMove(dx, dy, absolute)
}
module.exports = {
  keyTap,
  write,
  mouseMove,
}