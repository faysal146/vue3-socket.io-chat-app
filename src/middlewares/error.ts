import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import * as config from '../config/config'
import logger from '../config/logger'
import ApiError from '../utils/ApiError'

export const errorConverter = (err: any, req: Request, res: Response, next: NextFunction) => {
	let error = err
	if (!(error instanceof ApiError)) {
		const statusCode = error.statusCode
			? httpStatus.BAD_REQUEST
			: httpStatus.INTERNAL_SERVER_ERROR
		const message = error.message || httpStatus[statusCode]
		error = new ApiError(statusCode, message, false, err.stack)
	}
	next(error)
}
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
	let { statusCode, message } = err
	if (config.env === 'production' && !err.isOperational) {
		statusCode = httpStatus.INTERNAL_SERVER_ERROR
		err.message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR] as string
	}
	res.locals.errorMessage = err.message
	const response = {
		code: statusCode,
		message,
		...(config.env === 'development' && { stack: err.stack }),
	}
	if (config.env === 'development') {
		logger.error(err)
	}
	res.status(statusCode).send(response)
}
