import { NoteAddRequestModel } from 'src/notes/models/request/noteadd.request.model'
import { NoteAddResponseModel } from 'src/notes/models/response/inputadd.response.model'

export interface NoteAddInputPort {
  exec: (data: NoteAddRequestModel) => Promise<NoteAddResponseModel>
}
