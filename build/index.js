const args = process.argv.slice(2);

const options = {
  entryPoints: ["src/main.tsx"],
  bundle: true,
  outfile: "main.js",
  external: ["obsidian", "prismjs"],
  format: "cjs",
  inject: ["build/preact-shim.ts"],
  define: {
    ["process.env.BUILD"]: `"${args[0]}"`,
  },
};

if (args[0] === "dev") {
  options.sourcemap = "inline";
  options.watch = {
    onRebuild(error, result) {
      if (error) {
        console.error("watch build failed:", error);
      } else {
        console.log("watch build succeeded:", result);
      }
    },
  };
}

if (args[0] === "prod") {
  options.minify = true;
}

require("esbuild")
  .build(options)
  .then(() => {
    if (options.watch) {
      console.log("watching...");
    } else {
      console.log("build succeeded");
    }
  })
  .catch(() => process.exit(1));
