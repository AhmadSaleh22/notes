import { expressRouteAdapter } from '@core/adapters/primary/express/express_route.adapter'
import { Router } from 'express'
import { noteAddFactory } from '../factories/noteAdd_factory'

const noteRouter = Router()

const { noteAddController } = noteAddFactory()

noteRouter.post('/', expressRouteAdapter(noteAddController))

export default noteRouter
