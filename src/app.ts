import express, { Application } from 'express'
import cors from 'cors'
import routes from '~/routes/index.route'
import { responseError } from '~/utils/response'

const app: Application = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

routes(app)

app.use(function (err: any, req: any, res: any, next: any) {
  responseError(res, err)
})

export default app
