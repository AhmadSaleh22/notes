import { EventBroker, CloudEvent } from '@core/driven-port/event-broker-core'
import fs from 'fs'
import path from 'path'

const EVENT_LOG_FILE = path.join(__dirname, '../../data/events.log')

const getEventBrokerFile = (): EventBroker => {
  const dir = path.dirname(EVENT_LOG_FILE)

  // Ensure directory exists
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  // Ensure event log file exists
  if (!fs.existsSync(EVENT_LOG_FILE)) {
    fs.writeFileSync(EVENT_LOG_FILE, '', 'utf-8')
  }

  return {
    publish: async (event: CloudEvent) => {
      const eventData = `${JSON.stringify(event)}\n`
      return await new Promise((resolve, reject) => {
        fs.appendFile(EVENT_LOG_FILE, eventData, (err) => {
          if (err != null) {
            console.error('Error writing event to file:', err)
            return reject(err)
          }
          resolve()
        })
      })
    },

    subscribe: (type: string, callback: (event: CloudEvent) => void) => {
      let lastSize = 0

      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      const processNewEvents = () => {
        const stats = fs.statSync(EVENT_LOG_FILE)
        const newSize = stats.size

        if (newSize > lastSize) {
          const stream = fs.createReadStream(EVENT_LOG_FILE, {
            encoding: 'utf-8',
            start: lastSize,
            end: newSize
          })

          let buffer = ''
          stream.on('data', chunk => {
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            buffer += chunk
          })

          stream.on('end', () => {
            const events = buffer.trim().split('\n')
            for (const line of events) {
              if (line.length === 0) continue
              try {
                const event: CloudEvent = JSON.parse(line)
                if (event.type === type) {
                  callback(event)
                }
              } catch (err) {
                console.error('❌ Failed to parse event line:', line, err)
              }
            }

            lastSize = newSize
          })
        }
      }

      // Watch file changes
      fs.watchFile(EVENT_LOG_FILE, { interval: 500 }, processNewEvents)

      console.log(`📡 Subscribed to event: ${type}`)
    },
    stop: () => {
      fs.writeFile(EVENT_LOG_FILE, '', (err) => {
        if (err != null) {
          console.error('Error clearing event log:', err)
        } else {
          console.log('Event log cleared.')
        }
      })
    }
  }
}

export { getEventBrokerFile }
