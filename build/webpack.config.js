'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const path_1 = require('path')
exports.default = {
  resolve: {
    alias: {
      '@core': (0, path_1.resolve)(__dirname, 'src/core'),
      '@auth': (0, path_1.resolve)(__dirname, 'src/auth')
    }
  }
}
