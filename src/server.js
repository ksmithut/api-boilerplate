import fastify from 'fastify'
import * as uuid from 'uuid'

/**
 * @param {object} params
 * @param {import('pino').BaseLogger} params.logger
 */
export function configureServer ({ logger }) {
  const app = fastify({
    logger,
    genReqId: () => uuid.v4()
  })

  app.setNotFoundHandler((_request, reply) => {
    reply.status(404)
    reply.send({ code: 'ROUTE_NOT_FOUND' })
  })

  app.setErrorHandler((error, request, reply) => {
    // @ts-ignore - This is waiting review
    const { validation, validationContext } = error
    if (validation) {
      return reply.status(400).send({
        code: 'INVALID_PARAMS',
        details: { context: validationContext, errors: validation }
      })
    }
    request.log.error({ err: error, event: 'REQUEST_ERROR' })
    reply.status(500).send({ code: 'INTERNAL_SERVER_ERROR' })
  })

  return app
}
