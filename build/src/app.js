'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const core_1 = require('./core')
const http_1 = require('@driver/http')
const config_1 = require('@driven/config')
const sql_1 = require('@driven/database/sql')
const SecretStore_1 = require('@core/driven-port/SecretStore')
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function startServer () {
  try {
    // Load configurations
    const config = (0, config_1.getConfigs)()
    const secretStore = (0, SecretStore_1.getSecretStoreEnv)()
    // Initialize data store (async)
    const dataStore = await (0, sql_1.getDataStorage)({
      config: config.dataStore,
      secretStore
    })
    // Create the application instance
    const app = (0, core_1.getApp)({ dataStore })
    // Initialize the HTTP server
    const expresServer = (0, http_1.getHttpExpress)({ app, config: config.http })
    // ✅ Start the Express server by calling `.listen()`
    const PORT = (Boolean(config.http.port)) || 3000
    expresServer.server.listen(PORT, () => {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      console.log(`✅ Server is running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('❌ Failed to start the server:', error)
    process.exit(1)
  }
}
// Run the server startup function
void startServer()
