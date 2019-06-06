// https://medium.com/@tomaszmularczyk89/guide-to-building-a-react-components-library-with-rollup-and-styled-jsx-694ec66bd2
const pkg = require("./package.json");

const babel = require("rollup-plugin-babel");
const resolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");
const terser = require("rollup-plugin-terser").terser;
const NodeLicense = require("rollup-plugin-node-license");
const banner = require("rollup-plugin-banner").default;

const NODE_ENV = process.env.NODE_ENV || "development";
const isProd = NODE_ENV === "production";

const outputPrefix = "./lib/useBrowserState";
const outputFile = isProd
  ? outputPrefix + ".prod.cjs.js"
  : outputPrefix + ".dev.cjs.js";
const outputFileEs = isProd
  ? outputPrefix + ".prod.esm.js"
  : outputPrefix + ".dev.esm.js";

const str = `${pkg.name} v${pkg.version} (${pkg.license} license)
By: ${pkg.author}
${pkg.homepage}`;

export default {
  input: "./src/useBrowserState.js",
  output: [
    {
      file: outputFile,
      format: "cjs"
    },
    {
      file: outputFileEs,
      format: "esm"
    }
  ],
  // "react" is a peer dependency so don't bundle it
  // "stream" is a built-in node module only used in dev, so we do this to suppress errors
  external: id => /^react$/.test(id),
  plugins: [
    // JSX,
    babel({
      exclude: "node_modules/**"
    }),
    resolve(),
    commonjs(),
    isProd && terser(),
    isProd && new NodeLicense(),
    banner(str)
  ]
};
