import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import path from 'path'

export default defineConfig({
  plugins: [solidPlugin()],
  build: {
    // target: 'esnext',
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
      lib: path.resolve(__dirname, 'src/lib'),
      views: path.resolve(__dirname, 'src/views'),
      types: path.resolve(__dirname, 'src/types'),
      context: path.resolve(__dirname, 'src/context'),
      components: path.resolve(__dirname, 'src/components'),
      './runtimeConfig': './runtimeConfig.browser', // https://github.com/aws-amplify/amplify-js/issues/9639#issuecomment-1049158500
    },
  },
})
