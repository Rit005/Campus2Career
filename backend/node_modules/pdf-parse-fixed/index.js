const Fs = require("fs");
const Pdf = require("./lib/pdf-parse.js");

module.exports = Pdf;

let isDebugMode = !module.parent;
