import babel from '@rollup/plugin-babel'

export default {
  input: 'src/index.js',
  plugins: [
    babel({
      babelHelpers: 'bundled',
      presets: ['@babel/preset-react'],
    }),
  ],
  output: {
    file: 'index.js',
  },
}
