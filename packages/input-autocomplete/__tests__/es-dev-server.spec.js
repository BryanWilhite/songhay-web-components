module.exports = {
    appIndex: "packages/input-autocomplete/__tests__/index.html",
    babelExclude: [],
    babelModernExclude: [],
    babelModuleExclude: [],
    compatibilityMode: "auto",
    compress: true,
    debug: true,
    fileExtensions: [
        ".mjs",
        ".js",
        ".cjs",
        ".jsx",
        ".ts",
        ".tsx"
    ],
    http2: false,
    logErrorsToBrowser: true,
    logStartup: true,
    nodeResolve: {
        customResolveOptions: {
            moduleDirectory: [
                "node_modules",
                "web_modules"
            ],
            preserveSymlinks: false
        }
    },
    open: true,
    openBrowser: true, // translated from JSON and appears to ignored
    //openPath: "packages/input-autocomplete/__tests__/index.html", translated from JSON
    plugins: [],
    polyfillsLoader: true,
    port: 8080,
    readUserBabelConfig: false,
    responseTransformers: [],
    rootDir: "", // relative to where the `npm` script is run?
    watch: false,
    watchDebounce: 100
};
