import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    target: 'esnext',
    sourcemap: true,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'addToAsyncQueue',
      // the proper extensions will be added
      fileName: 'async-fn',
    }
  },
  plugins: [
    dts({
      rollupTypes: true, // will merge all declarations together
      include: ["src/**/*"]
    })
  ]
})
