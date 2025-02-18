import { NoteAddDTOModel } from '../models/dto/noteadd.dto.model'
import { NoteAddRequestModel } from '../models/request/noteadd.request.model'
import { NoteAddResponseModel } from '../models/response/inputadd.response.model'
import { NoteAddInputPort } from '../ports/input/notesadd_input.port'
import { NoteAddOutputPort } from '../ports/port/insertnote_output.port'

export class NoteAddUseCase implements NoteAddInputPort {
  constructor (
    private readonly port: NoteAddOutputPort
  ) {}

  async exec (data: NoteAddRequestModel): Promise<NoteAddResponseModel> {
    const newNote: NoteAddDTOModel = {
      title: data.title,
      content: data.content
    }

    await this.port.createNote(newNote)

    return {
      id: '43094904309',
      title: '',
      content: ''
    }
  }
}
