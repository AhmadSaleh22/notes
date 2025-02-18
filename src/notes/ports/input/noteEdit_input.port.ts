import { NoteEditRequestModel } from 'src/notes/models/request/noteEdit.request.model'
import { NoteEditResponseModel } from 'src/notes/models/response/inputedit.response.model'

export interface NoteEditInput {
  name?: string
  description?: string
  exec: (data: NoteEditRequestModel) => Promise<NoteEditResponseModel>
}
