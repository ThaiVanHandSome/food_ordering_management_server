import express, { Application } from 'express'
import cors from 'cors'
import routes from '~/routes/index.route'
import { responseError } from '~/utils/response'
import { createServer } from 'http'
import { Server } from 'socket.io'

const app: Application = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type']
  }
})

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

routes(app)

export const userSockets: any = {}
io.on('connection', (socket) => {
  console.log('A user connected: ' + socket.id)

  socket.on('registerUser', (userId) => {
    userSockets[userId] = socket
  })

  socket.on('addOrder', () => {})

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
    for (const userId in userSockets) {
      if (userSockets[userId] === socket) {
        delete userSockets[userId]
        break
      }
    }
  })
})

app.use(function (err: any, req: any, res: any, next: any) {
  responseError(res, err)
})

export default app
export { server, io }
