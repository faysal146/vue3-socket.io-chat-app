import express from 'express'
import httpStatus from 'http-status'
import helmet from 'helmet'
// @ts-ignore
import xss from 'xss-clean'
// @ts-ignore
import compression from 'compression'
import cors from 'cors'
import * as config from './config/config'
import * as morgan from './config/morgan'
import ApiError from './utils/ApiError'
import { errorConverter, errorHandler } from './middlewares/error'

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

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
	next(new ApiError(httpStatus.NOT_FOUND, 'Not found'))
})
// convert error to ApiError, if needed
app.use(errorConverter)
// handle error
app.use(errorHandler)

export default app
