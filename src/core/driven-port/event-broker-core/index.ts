interface CloudEvent {
  specversion: string
  type: string
  source: string
  subject: string
  id: string
  time: string
  datacontenttype: string
  data: object
}

type publishEvent = (event: CloudEvent) => Promise<void>

type subscribeEvent = (type: string, callback: (event: CloudEvent) => void) => void

interface EventBroker {
  publish: publishEvent
  subscribe: subscribeEvent
  stop: () => void
}

export { EventBroker, CloudEvent, publishEvent, subscribeEvent }
