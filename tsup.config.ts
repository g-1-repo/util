import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    // Main entry point
    index: 'src/index.ts',
    // Individual module entry points for tree-shaking
    'array/index': 'src/array/index.ts',
    'async/index': 'src/async/index.ts', 
    'date/index': 'src/date/index.ts',
    'string/index': 'src/string/index.ts',
    'object/index': 'src/object/index.ts',
    'math/index': 'src/math/index.ts',
    'validation/index': 'src/validation/index.ts',
    'web/index': 'src/web/index.ts',
    'node/index': 'src/node/index.ts',
    'node/git-utils': 'src/node/git-utils.ts',
    'node/prompt-utils': 'src/node/prompt-utils.ts',
    'types/index': 'src/types/index.ts',
    'crypto/index': 'src/crypto/index.ts',
    'database/index': 'src/database/index.ts',
    'debug/index': 'src/debug/index.ts',
    'http/index': 'src/http/index.ts'
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: true, // Enable code splitting
  sourcemap: process.env.NODE_ENV !== 'production', // Only in development
  clean: true,
  minify: process.env.NODE_ENV === 'production', // Minify for production
  target: 'es2022',
  outDir: 'dist',
  bundle: true,
  treeshake: true,
  external: ['child_process', 'fs', 'readline', 'path', 'os'],
  noExternal: ['nanoid'], // Bundle small dependencies
  platform: 'neutral',
  // Optimize chunks with more aggressive splitting
  esbuildOptions: (options) => {
    options.chunkNames = 'chunks/[name]-[hash]'
    options.mangleProps = /^_/ // Mangle private properties
    // More aggressive code splitting
    options.splitting = true
    options.mainFields = ['module', 'main']
    // Split large files into smaller chunks
    if (process.env.NODE_ENV === 'production') {
      options.treeShaking = true
      options.minifyWhitespace = true
      options.minifyIdentifiers = true
      options.minifySyntax = true
    }
  }
})
