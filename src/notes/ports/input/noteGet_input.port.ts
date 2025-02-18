import { NoteGetResponseModel } from 'src/notes/models/response/inputget.response.model'

export interface NoteGetInput {
  name?: string
  description?: string
  exec: (noteId: string) => Promise<NoteGetResponseModel>
}
