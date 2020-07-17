'use strict'

const { default: micro, send } = require('micro')
const uuid = require('uuid')
const {
  createHook,
  initHooks,
  useDuration,
  useResponse
} = require('./lib/micro-hook')

/**
 * @param {object} params
 * @param {import('pino').BaseLogger} params.logger
 * @param {import('knex')} params.knex
 * @param {import('nodemailer').Transporter} params.mail
 * @param {import('./services/jwt').JWTService} params.jwt
 */
function configureServer ({ logger, knex, mail, jwt }) {
  const useRequestId = createHook(req => {
    const res = useResponse(req)
    const requestId = req.headers['x-request-id'] || uuid.v4()
    res.setHeader('X-Request-Id', requestId)
    return requestId
  })
  const useLogger = createHook(req => {
    return logger.child({ requestId: useRequestId(req) })
  })
  const logRequest = createHook(req => {
    const res = useResponse(req)
    const logger = useLogger(req)
    function onFinish () {
      const duration = useDuration(req)
      logger.info({ req, res, duration: Number(duration) / 1e6 })
      res.removeListener('finish', onFinish)
    }
    res.on('finish', onFinish)
    return null
  })
  const useContext = createHook(req => ({
    logger: useLogger(req),
    mail,
    knex,
    jwt
  }))

  const handler = initHooks(async (req, res) => {
    try {
      logRequest(req)
      useContext(req)
      send(res, 200, 'Hello World')
    } catch (err) {
      const logger = useLogger(req)
      logger.error({ err })
      send(res, 500, 'Internal Server Error')
    }
  })

  const server = micro(handler)
  return server
}

exports.configureServer = configureServer
