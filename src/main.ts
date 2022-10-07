import app from './app'
import * as config from './config/config'
import logger from './config/logger'

const server = app.listen(config.port, () => {
	logger.info(`Listening to port ${config.port}`)
})
// logger.info('Connected to MongoDB')
const exitHandler = (): void => {
	if (server) {
		server.close(() => {
			logger.info('Server closed')
			process.exit(1)
		})
	} else {
		process.exit(1)
	}
}
const unexpectedErrorHandler = (error: any): void => {
	logger.error(error)
	exitHandler()
}
process.on('uncaughtException', unexpectedErrorHandler)
process.on('unhandledRejection', unexpectedErrorHandler)
process.on('SIGTERM', () => {
	logger.info('SIGTERM received')
	if (server) {
		server.close()
	}
})
