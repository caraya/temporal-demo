import resolve from '@rollup/plugin-node-resolve'
import postcss from 'rollup-plugin-postcss'
import terser from '@rollup/plugin-terser'
import compiler from '@ampproject/rollup-plugin-closure-compiler'
import { default as importHTTP } from 'import-http/rollup.js'
import babel from '@rollup/plugin-babel'

const dev = [
  {
    input: 'app/js/index.js',
    output: {
      file: 'app/bundle.js',
      format: 'esm',
      sourcemap: 'inline',
    },
    plugins: [
      resolve(),
      importHTTP(),
      postcss({
        inject: false,
      }),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        "presets": [
          [ "@babel/env" ]
        ]
      }),
    ],
    watch: {
      exclude: [ 'node_modules/**' ],
    },
  },
  // {
  //   input: 'app/ts/index.ts',
  //   output: {
  //     file: 'app/bundle-ts.js',
  //     format: 'esm',
  //     sourcemap: 'inline',
  //   },
  //   plugins: [
  //     postcss({
  //       inject: false,
  //     }),
  //   ],
  //   watch: {
  //     exclude: [ 'node_modules/**' ],
  //   },
  // },
]

const prod = [
  {
    input: 'app/js/index.js',
    output: {
      file: 'dist/bundle.js',
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      importHTTP(),
      postcss({
        extract: true,
        minimize: { preset: 'default' },
      }),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        "presets": [
          [ "@babel/env" ]
        ]
      }),
      terser(),
      compiler(),
    ]
  },
  // {
  //   input: 'app/ts/index.ts',
  //   output: {
  //     file: 'app/bundle-ts.js',
  //   },
  //   plugins: [
  //       postcss({
  //       inject: false,
  //     }),
  //     terser()
  //   ],
  //   watch: {
  //     exclude: [ 'node_modules/**' ],
  //   },
  // }
]

export default process.env.NODE_ENV === 'production'
  ? prod
  : dev