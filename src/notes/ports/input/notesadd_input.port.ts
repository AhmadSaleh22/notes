import { NoteAddRequestModel } from 'src/notes/models/request/noteadd.request.model'
import { NoteAddResponseModel } from 'src/notes/models/response/inputadd.response.model'

export interface NoteAddInputPort {
  name?: string
  description?: string
  exec: (data: NoteAddRequestModel) => Promise<NoteAddResponseModel>
}
