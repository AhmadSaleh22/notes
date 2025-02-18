import { NoteEditRequestModel } from '../models/request/noteEdit.request.model'
import { NoteEditResponseModel } from '../models/response/inputedit.response.model'
import { NoteEditInput } from '../ports/input/noteEdit_input.port'
import { NoteAddOutputPort } from '../ports/port/insertnote_output.port'

export class NoteEditUseCase implements NoteEditInput {
  constructor (
    private readonly port: NoteAddOutputPort
  ) {}

  async exec (data: NoteEditRequestModel): Promise<NoteEditResponseModel> {
    await this.port.updateNote(data)

    return {
      id: '',
      title: '',
      content: ''
    }
  }
}
