import { Application } from 'express'
import UserRouter from './user.route'
import AuthRouter from './auth.route'
import OrderRouter from './order.route'
import CategoryRouter from './category.route'
import TableRouter from './table.route'
import ProductRouter from './product.route'

const routes = (app: Application) => {
  app.use('/api/users', UserRouter)
  app.use('/api/auth', AuthRouter)
  app.use('/api/orders', OrderRouter)
  app.use('/api/categories', CategoryRouter)
  app.use('/api/tables', TableRouter)
  app.use('/api/products', ProductRouter)
}

export default routes
