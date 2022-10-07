import express from 'express'
import helmet from 'helmet'
// @ts-ignore
import xss from 'xss-clean'
// @ts-ignore
import compression from 'compression'
import cors from 'cors'
import * as config from './config/config'
import * as morgan from './config/morgan'

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

export default app
