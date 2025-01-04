import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import svelte from 'rollup-plugin-svelte'
import { sveltePreprocess } from 'svelte-preprocess'
import css from 'rollup-plugin-css-only'

const dev = process.argv.includes('--config-dev')

const wp_externals = {
  '@wordpress/blocks': 'wp.blocks',
  '@wordpress/components': 'wp.components',
  '@wordpress/compose': 'wp.compose',
  '@wordpress/core-data': 'wp.coreData',
  '@wordpress/data': 'wp.data',
  '@wordpress/edit-post': 'wp.editPost',
  '@wordpress/element': 'wp.element',
  '@wordpress/i18n': 'wp.i18n',
  '@wordpress/plugins': 'wp.plugins',
  'react': 'React',
  'react-dom': 'ReactDOM'
}

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
        preprocess: sveltePreprocess(),
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
  },
  {
    input: './assets/ts/gutenberg/document-panel.ts',
    output: {
      dir: './assets/js/gutenberg',
      format: 'iife',
      name: 'PPREKGutenberg',
      globals: wp_externals,
      sourcemap: dev
    },
    external: Object.keys(wp_externals),
    plugins: [
      nodeResolve({
        browser: true,
        preferBuiltins: false,
        extensions: ['.js', '.ts', '.json']
      }),
      typescript({
        tsconfig: './tsconfig.gutenberg.json',
        sourceMap: dev
      }),
      !dev ? terser() : null
    ].filter(Boolean)
  }
]
