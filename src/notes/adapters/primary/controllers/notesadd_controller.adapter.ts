import { RequestValidationErrorAdapter } from '@core/adapters/primary/errors/request_validation_error.adapter'
import { HttpRequestModel } from '@core/models/http/http_request.model'
import { ResponseModel } from '@core/models/http/http_response.model'
import { ControllerInputPort } from '@core/ports/input/controller/controller.port'
import { HttpResponseOutputPort } from '@core/ports/output/http/http_response.port'
import { ObjectKeyExist } from '@shared/validations/object_validation'
import { NoteAddRequestModel } from 'src/notes/models/request/noteadd.request.model'
import { NoteDeleteRequestModel } from 'src/notes/models/request/notedelete.request.model'
import { NoteEditRequestModel } from 'src/notes/models/request/noteEdit.request.model'
import { NoteAddResponseModel } from 'src/notes/models/response/inputadd.response.model'
import { NoteDeleteResponseModel } from 'src/notes/models/response/inputDelete.response.model'
import { NoteEditResponseModel } from 'src/notes/models/response/inputedit.response.model'
import { NoteAddUseCase } from 'src/notes/usecases/noteAdd_usecase'
import { NoteDeleteUseCase } from 'src/notes/usecases/noteDelete_usecase'
import { NoteEditUseCase } from 'src/notes/usecases/noteEdit_usecase'

export class NoteAddController implements ControllerInputPort<NoteAddResponseModel | never> {
  constructor (
    private readonly usecase: NoteAddUseCase,
    private readonly presenter: HttpResponseOutputPort<NoteAddResponseModel>
  ) {}

  async handleRequest (request: HttpRequestModel<NoteAddRequestModel>): Promise<ResponseModel<NoteAddResponseModel>> | never {
    try {
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!ObjectKeyExist(request, 'body')) {
        throw RequestValidationErrorAdapter.handleError('Invalid body Request')
      }
      const { title, content } = request.body
      const noteId = await this.usecase.exec({ title, content })
      return await this.presenter.handleResponse(noteId, 'Note Has Been Created')
    } catch (error) {
      throw RequestValidationErrorAdapter.handleError(String(error))
    }
  }
}

export class NoteDeleteController implements ControllerInputPort<NoteDeleteResponseModel | never> {
  constructor (
    private readonly usecase: NoteDeleteUseCase,
    private readonly presenter: HttpResponseOutputPort<NoteDeleteResponseModel>
  ) {}

  async handleRequest (request: HttpRequestModel<NoteDeleteRequestModel>): Promise<ResponseModel<NoteDeleteResponseModel>> | never {
    try {
      if (!ObjectKeyExist(request, 'body')) {
        throw RequestValidationErrorAdapter.handleError('Invalid body Request')
      }
      const { noteid } = request.body
      const noteId = await this.usecase.exec(noteid)
      return await this.presenter.handleResponse(noteId, 'Note Has Been Deleted Successfully')
    } catch (error) {
      throw RequestValidationErrorAdapter.handleError(String(error))
    }
  }
}

export class NoteEditController implements ControllerInputPort<NoteEditResponseModel | never> {
  constructor (
    private readonly usecase: NoteEditUseCase,
    private readonly presenter: HttpResponseOutputPort<NoteEditResponseModel>
  ) {}

  async handleRequest (request: HttpRequestModel<NoteEditRequestModel>): Promise<ResponseModel<NoteEditResponseModel>> | never {
    try {
      if (!ObjectKeyExist(request, 'body')) {
        throw RequestValidationErrorAdapter.handleError('Invalid body Request')
      }
      const { title, content, noteid } = request.body
      const noteId = await this.usecase.exec({ title, content, noteid })
      return await this.presenter.handleResponse(noteId, 'Note Has Been Created')
    } catch (error) {
      throw RequestValidationErrorAdapter.handleError(String(error))
    }
  }
}

export class NoteGetController implements ControllerInputPort<NoteEditResponseModel | never> {
  constructor (
    private readonly usecase: NoteEditUseCase,
    private readonly presenter: HttpResponseOutputPort<NoteEditResponseModel>
  ) {}

  async handleRequest (request: HttpRequestModel<NoteEditRequestModel>): Promise<ResponseModel<NoteEditResponseModel>> | never {
    try {
      if (!ObjectKeyExist(request, 'body')) {
        throw RequestValidationErrorAdapter.handleError('Invalid body Request')
      }
      const { title, content, noteid } = request.body
      const noteId = await this.usecase.exec({ title, content, noteid })
      return await this.presenter.handleResponse(noteId, 'Note Has Been Created')
    } catch (error) {
      throw RequestValidationErrorAdapter.handleError(String(error))
    }
  }
}
