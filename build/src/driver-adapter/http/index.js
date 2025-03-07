'use strict'
const __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { default: mod }
}
Object.defineProperty(exports, '__esModule', { value: true })
exports.getHttpExpress = void 0
const express_1 = __importDefault(require('express'))
const app_js_1 = require('./app.js')
const server_js_1 = require('./server.js')
const getHttpExpress = ({ app, config }) => {
  const expressApp = (0, express_1.default)()
  const httpApp = (0, app_js_1.getHttpAppExpress)({ app })
  expressApp.use('/api', httpApp)
  const httpServer = (0, server_js_1.getExpressOpenApiServer)({ app: expressApp, port: config.port })
  return {
    app: expressApp,
    server: httpServer
  }
}
exports.getHttpExpress = getHttpExpress
