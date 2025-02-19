import { RequestValidationErrorAdapter } from '@core/adapters/primary/errors/request_validation_error.adapter'
import { CLICommandsModel } from '@core/models/CLI/CLI.model'
import { ResponseModel } from '@core/models/http/http_response.model'
import { ControllerInputPort } from '@core/ports/input/controller/controller.port'
import { HttpResponseOutputPort } from '@core/ports/output/http/http_response.port'
import { ObjectKeyExist } from '@shared/validations/object_validation'
import { NoteAddRequestModel } from 'src/notes/models/request/noteadd.request.model'
import { NoteDeleteRequestModel } from 'src/notes/models/request/notedelete.request.model'
import { NoteAddResponseModel } from 'src/notes/models/response/inputadd.response.model'
import { NoteDeleteResponseModel } from 'src/notes/models/response/inputDelete.response.model'
import { NoteAddUseCase } from 'src/notes/usecases/noteAdd_usecase'
import { NoteDeleteUseCase } from 'src/notes/usecases/noteDelete_usecase'

export class NoteAddCliController implements ControllerInputPort<NoteAddResponseModel, NoteAddRequestModel> {
  constructor (
    private readonly usecase: NoteAddUseCase,
    private readonly presenter: HttpResponseOutputPort<NoteAddResponseModel>
  ) {}

  async handleCommand (
    command: CLICommandsModel<NoteAddRequestModel>
  ): Promise<ResponseModel<NoteAddResponseModel>> | never {
    try {
      // Validate the request
      if (!ObjectKeyExist(command.content, 'content') || !ObjectKeyExist(command.content, 'title') || !ObjectKeyExist(command, 'command')) {
        throw RequestValidationErrorAdapter.handleError('Invalid request: "content" and "title" are required')
      }

      // Extract content and title from the request
      const { content, title } = command.content

      // Execute the use case
      const noteId = await this.usecase.exec({ title, content })

      // Format the response using the presenter
      return await this.presenter.handleResponse(
        noteId,
        'Note has been created successfully'
      )
    } catch (error) {
      // Handle errors
      throw RequestValidationErrorAdapter.handleError(String(error))
    }
  }
}

export class NoteDeleteCliController implements ControllerInputPort<NoteDeleteResponseModel, NoteDeleteRequestModel> {
  constructor (
    private readonly usecase: NoteDeleteUseCase,
    private readonly presenter: HttpResponseOutputPort<NoteDeleteResponseModel>
  ) {}

  async handleCommand (
    command: CLICommandsModel<NoteDeleteRequestModel>
  ): Promise<ResponseModel<NoteDeleteResponseModel>> | never {
    try {
      if (!ObjectKeyExist(command, 'content')) {
        throw RequestValidationErrorAdapter.handleError('Invalid body Request')
      }
      const { content } = command
      const noteId = await this.usecase.exec(content.id)
      return await this.presenter.handleResponse(noteId, 'Note Has Been Deleted Successfully')
    } catch (error) {
      throw RequestValidationErrorAdapter.handleError(String(error))
    }
  }
}
