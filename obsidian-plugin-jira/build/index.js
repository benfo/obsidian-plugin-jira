const dotenv = require("dotenv");
const path = require("path");
const build = require("esbuild").build;
const copyStaticFiles = require("esbuild-copy-static-files");

dotenv.config();
const args = process.argv.slice(2);
const TARGET = args[0];
const OUT_PATH = process.env.OUT_PATH ?? "./";
const OUT_FILE = "main.js";

const watch = {
  onRebuild(error, result) {
    if (error) {
      console.error("watch build failed:", error);
    } else {
      console.log("watch build succeeded:", result);
    }
  },
};

const options = {
  entryPoints: ["src/main.tsx"],
  bundle: true,
  minify: TARGET === "prod" ? true : false,
  sourcemap: TARGET === "prod" ? undefined : "inline",
  outfile: path.join(OUT_PATH, OUT_FILE),
  external: ["obsidian", "prismjs"],
  format: "cjs",
  inject: ["build/preact-shim.ts"],
  define: {
    ["process.env.BUILD"]: `"${args[0]}"`,
  },
  watch: TARGET === "dev" ? watch : undefined,
  plugins: [
    copyStaticFiles({
      src: "./assets",
      dest: OUT_PATH,
    }),
  ],
};

build(options)
  .then(() => {
    if (options.watch) {
      console.log("watching...");
    } else {
      console.log("build succeeded");
    }
  })
  .catch(() => process.exit(1));
