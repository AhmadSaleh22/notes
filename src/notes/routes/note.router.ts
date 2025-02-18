import { expressRouteAdapter } from '@core/adapters/primary/express/express_route.adapter'
import { Router } from 'express'
import { noteAddFactory as noteFactory } from '../factories/noteAdd_factory'

const noteRouter = Router()

const { noteAddController } = noteFactory()

noteRouter.post('/', expressRouteAdapter(noteAddController))

export default noteRouter
