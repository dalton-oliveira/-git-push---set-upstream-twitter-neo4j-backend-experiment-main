import { HttpError } from 'http-errors'
import { Request, Response, NextFunction } from 'express'

/* eslint-disable @typescript-eslint/no-unused-vars */
export default function errorMiddleware(error: HttpError | any, req: Request, res: Response, next: NextFunction) {
  /**
   * Set the correct media type for a response containing a
   * JSON formatted problem details object.
   *
   * @see https://tools.ietf.org/html/rfc7807#section-3
   */
  res.set('Content-Type', 'application/problem+json')
  res.status(error.status || 500).json({
    message: error.message,
    details: error.details,
  })
}
/* eslint-enable @typescript-eslint/no-unused-vars */
