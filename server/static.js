import express from "express";
import fs from "fs";
import path from "path";

// In the compiled CJS, __dirname is available. In the raw ESM, we need an alternative.
// We can use a universal approach or just process.cwd() for the project root if needed.
// However, since esbuild is compiling to CJS, `__dirname` will be the directory of dist/index.cjs.
// Let's use robust path resolution using process.cwd() or fallback.
const currentDir = typeof __dirname !== 'undefined' ? __dirname : process.cwd();
export function serveStatic(app) {
    const distPath = path.resolve(currentDir, "public");
    if (!fs.existsSync(distPath)) {
        throw new Error(`Could not find the build directory: ${distPath}, make sure to build the client first`);
    }
    app.use(express.static(distPath));
    // fall through to index.html if the file doesn't exist
    app.use("/{*path}", (_req, res) => {
        res.sendFile(path.resolve(distPath, "index.html"));
    });
}
