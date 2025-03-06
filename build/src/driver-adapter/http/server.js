'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.getExpressOpenApiServer = void 0
const getExpressOpenApiServer = ({ app, port }) => {
  const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
  })
  return server
}
exports.getExpressOpenApiServer = getExpressOpenApiServer
