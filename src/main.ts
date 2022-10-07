import { Server } from 'socket.io'
import express from 'express'
import { createServer } from 'http'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.use(express.json())

const httpServer = createServer(app)
const io = new Server(httpServer, {
	cors: {
		origin: '*',
	},
})

io.on('connection', () => {
	console.log('client connected')
})

const PORT = process.env.PORT === '' ? 3000 : process.env.PORT
httpServer.listen(PORT, () => {
	console.log(`server running on port ${PORT}`)
})
