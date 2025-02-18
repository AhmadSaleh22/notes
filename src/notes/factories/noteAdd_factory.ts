import { ResourceCreatedHttpPresenter } from '@core/adapters/primary/presnters/resource_created_http.presenter'
import { noteAddOutputPort } from '../adapters/secondary/repositories'
import { NoteAddUseCase } from '../usecases/noteAdd_usecase'
import { NoteAddResponseModel } from '../models/response/inputadd.response.model'
import { NoteAddController } from '../adapters/primary/controllers/notesadd_controller.adapter'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const noteAddFactory = () => {
  const usecase = new NoteAddUseCase(
    noteAddOutputPort
  )

  const presenter = new ResourceCreatedHttpPresenter<NoteAddResponseModel>()

  const noteAddController = new NoteAddController(
    usecase,
    presenter
  )

  return {
    noteAddController
  }
}
