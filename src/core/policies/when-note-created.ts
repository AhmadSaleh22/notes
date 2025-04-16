import type { EventBroker } from '@core/driven-port/event-broker-core'
import { FileStore } from '@core/driven-port/fileManage/file-manage'

type WhenNoteCreated = (eventBroker: EventBroker, fileManage: FileStore) => void

const whenNoteCreated: WhenNoteCreated = (eventBroker, fileStore) => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  eventBroker.subscribe('note.created', async (event) => { // Make callback async
    // Check if event is valid;
    try {
      console.log('Event received: event', event)
      const key = event.subject
      const path = `notes/${key}`
      const newNoteBuffer = Buffer.from(JSON.stringify(event.data), 'utf-8')

      const currentSavedNote = await fileStore.get(key) // Await file retrieval

      if (currentSavedNote != null) {
        // await fileStore.upload(path, newNoteBuffer) // Await upload
      } else {
        await fileStore.upload(path, newNoteBuffer) // Await upload
      }

      console.log(`Note ${key} has been saved/updated at ${path}`)
    } catch (error) {
      console.error('Error processing note.created event:', error)
    }
  })
}

export { whenNoteCreated }
