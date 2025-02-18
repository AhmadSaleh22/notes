import { NoteDeleteResponseModel } from '../models/response/inputDelete.response.model'
import { NoteDeleteInput } from '../ports/input/noteDelete_input.port'
import { NoteAddOutputPort } from '../ports/port/insertnote_output.port'

export class NoteDeleteUseCase implements NoteDeleteInput {
  constructor (
    private readonly port: NoteAddOutputPort
  ) {}

  async exec (noteId: string): Promise<NoteDeleteResponseModel> {
    await this.port.deleteNote(noteId)

    return {
      message: 'Note Deleted Successfully'
    }
  }
}
