import { resolve } from 'path'

export default {
  resolve: {
    alias: {
      '@core': resolve(__dirname, 'src/core'),
      '@auth': resolve(__dirname, 'src/auth')
    }
  }
}
