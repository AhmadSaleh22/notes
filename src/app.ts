/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { getApp } from './core'
import { getHttpExpress } from './driver-adapter/http'
import { getDataStorage } from './driven-adapter/database/sql'
import { getSecretStoreEnv } from './core/driven-port/SecretStore'
import { getConfigs } from './driven-adapter/config'
import { getEventBrokerFile } from './driven-adapter/event-broker/event-broker'
import { whenNoteCreated } from './core/policies/when-note-created'
import { getFileStoreLocal } from './driven-adapter/event-broker/local-file-store'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function startServer () {
  try {
    // Load configurations
    const eventBroker = getEventBrokerFile()
    const fileStore = getFileStoreLocal()
    const config = getConfigs()
    const secretStore = getSecretStoreEnv()

    // Initialize data store (async)
    const dataStore = await getDataStorage({
      config: config.dataStore,
      secretStore
    })

    // Create the application instance
    const app = await getApp({ dataStore, eventBroker })

    console.log('dataStore', app)
    // Initialize the HTTP server
    getHttpExpress({ app, config: config.http })

    whenNoteCreated(eventBroker, fileStore)
    // ✅ Fix: Ensure `PORT` is a valid number
    // const PORT = config.http.port ?? 3000

    // if (isNaN(PORT) || PORT < 0 || PORT > 65535) {
    //   throw new Error(`Invalid PORT value: "${config.http.port}". Please check your configuration.`)
    // }

    // expresServer.server.listen(PORT, () => {
    //   console.log(`✅ Server is running on http://localhost:${PORT}`)
    // })
  } catch (error) {
    console.error('❌ Failed to start the server:', error)
    process.exit(1)
  }
}

// Run the server startup function
void startServer()
