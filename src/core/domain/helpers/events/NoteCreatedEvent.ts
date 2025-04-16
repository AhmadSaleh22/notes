import { Note } from '@core/domain/entities/note'
import type { CloudEvent } from '@core/driven-port/event-broker-core'

type NoteCreatedEvent = ({
  note,
  subject,
  source
}: {
  note: Note
  subject: string
  source: string
}) => CloudEvent

const noteCreatedEvent: NoteCreatedEvent = ({
  note,
  subject,
  source
}) => {
  return {
    id: note.id,
    specversion: '1.0',
    datacontenttype: 'application/json',
    datacontentencoding: 'utf-8',
    data: note,
    eventtypeversion: '1.0',
    type: 'note.created',
    eventid: note.id,
    eventtime: new Date().toISOString(),
    source,
    subject,
    time: new Date().toISOString()
  }
}
export type { NoteCreatedEvent }
export default noteCreatedEvent
