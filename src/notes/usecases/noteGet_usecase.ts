import { NoteGetResponseModel } from '../models/response/inputget.response.model'
import { NoteGetInput } from '../ports/input/noteGet_input.port'
import { NoteAddOutputPort } from '../ports/port/insertnote_output.port'

export class NoteGetUseCase implements NoteGetInput {
  constructor (
    private readonly port: NoteAddOutputPort
  ) {}

  async exec (noteId: string): Promise<NoteGetResponseModel> {
    await this.port.getNote(noteId)

    return {
      id: '',
      title: '',
      content: ''
    }
  }
}
