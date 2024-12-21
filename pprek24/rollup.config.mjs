import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import svelte from 'rollup-plugin-svelte'
import { sveltePreprocess } from 'svelte-preprocess'
import css from 'rollup-plugin-css-only'

/** @type {string[]} */
const args = process.argv

const dev = args.includes('--config-dev')

export default [
  {
    input: './assets/ts/app.ts',
    output: {
      dir: './assets/js',
      format: 'esm',
      sourcemap: dev
    },
    plugins: [
      nodeResolve({
        browser: true,
        dedupe: ['svelte'],
        extensions: ['.js', '.ts', '.svelte', '.json', '.mjs']
      }),
      svelte({
        compilerOptions: {
          dev
        },
        proprocess: sveltePreprocess(),
        emitCss: true
      }),
      css({
        output: 'svelte.css'
      }),
      typescript({
        tsconfig: './tsconfig.json',
        sourceMap: dev,
        include: ['assets/**/*.ts'],
        resolveJsonModule: true,
        moduleResolution: 'node'
      }),
      !dev ? terser() : null
    ].filter(Boolean)
  }
]
