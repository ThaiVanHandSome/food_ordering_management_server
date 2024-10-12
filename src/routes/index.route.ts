import { Application } from 'express'
import UserRouter from './user.route'
import AuthRouter from './auth.route'
import OrderRouter from './order.route'
import CategoryRouter from './category.route'

const routes = (app: Application) => {
  app.use('/api/user', UserRouter)
  app.use('/api/auth', AuthRouter)
  app.use('/api/orders', OrderRouter)
  app.use('/api/categories', CategoryRouter)
}

export default routes
