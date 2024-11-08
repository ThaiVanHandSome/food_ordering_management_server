import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { server } from '~/app'

dotenv.config()

const port = process.env.PORT ?? 8080
;(async () => {
  const chalk = (await import('chalk')).default

  // Chalk styles
  const connected = chalk.bold.cyan
  const error = chalk.bold.yellow
  const disconnected = chalk.bold.red

  const mongoUri = process.env.MONGO_URI
  if (!mongoUri) {
    console.error(error('MongoDB URI is not defined in the environment variables!'))
    process.exit(1)
  }

  mongoose
    .connect(mongoUri)
    .then(() => {
      console.log('Connection to MongoDB successfully!')
    })
    .catch((err) => {
      console.error(error('Failed to connect to MongoDB:', err))
      process.exit(1)
    })

  mongoose.connection.on('connected', () => {
    console.log(connected('Mongoose default connection is open to MongoDB Atlas'))
  })

  mongoose.connection.on('error', (err) => {
    console.log(error('Mongoose default connection has occurred ' + err + ' error'))
  })

  mongoose.connection.on('disconnected', () => {
    console.log(disconnected('Mongoose default connection is disconnected'))
  })

  server.listen(port, () => {
    console.log(chalk.green(`Server is running on port ${port}`))
  })
})()
