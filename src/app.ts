import httpStatus from 'http-status'
import express from 'express'
import helmet from 'helmet'
// @ts-ignore
import xss from 'xss-clean'
// @ts-ignore
import compression from 'compression'
import cors from 'cors'
import * as config from './config/config'
import * as morgan from './config/morgan'
import { errorConverter, errorHandler } from './middlewares/error'
import ApiError from './utils/ApiError'
import routes from './routes/v1/routes'

const app = express()

if (config.env !== 'test') {
	app.use(morgan.successHandler)
	app.use(morgan.errorHandler)
}
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(xss())
app.use(compression())
app.use(cors())
app.options('*', cors())

// v1 api routes
app.use('/api/v1', routes)
// send back a 404 error for any unknown api request
app.use((req, res, next) => {
	next(new ApiError(httpStatus.NOT_FOUND, 'Not found'))
})
// convert error to ApiError, if needed
app.use(errorConverter)
// handle error
app.use(errorHandler)

//

export default app
