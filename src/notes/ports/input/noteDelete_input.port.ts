import { NoteDeleteResponseModel } from 'src/notes/models/response/inputDelete.response.model'

export interface NoteDeleteInput {
  name?: string
  description?: string
  exec: (noteId: string) => Promise<NoteDeleteResponseModel>
}
