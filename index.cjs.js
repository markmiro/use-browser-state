if (process.env.NODE_ENV === "production") {
  module.exports = require("./lib/useBrowserState.prod.cjs.js");
} else {
  module.exports = require("./lib/useBrowserState.dev.cjs.js");
}
