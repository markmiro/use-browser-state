if (process.env.NODE_ENV === "production") {
  module.exports = require("./lib/useBrowserState.prod.esm.js");
} else {
  module.exports = require("./lib/useBrowserState.dev.esm.js");
}
