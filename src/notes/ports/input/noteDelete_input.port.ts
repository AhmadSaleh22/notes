import { NoteDeleteResponseModel } from 'src/notes/models/response/inputDelete.response.model'

export interface NoteDeleteInput {
  exec: (noteId: string) => Promise<NoteDeleteResponseModel>
}
