'use strict'

const pino = require('pino')
const serializers = require('pino-std-serializers')
const z = require('zod')

const logLevelSchema = z.enum([
  'silent',
  'trace',
  'debug',
  'info',
  'warn',
  'error',
  'fatal'
])

/**
 * @param {object} options
 * @param {string} options.name
 * @param {string} options.logLevel
 * @param {boolean} [options.pretty=false]
 * @returns {import('pino').BaseLogger}
 */
function configureLogger ({ name, logLevel, pretty = false }) {
  return pino({
    name,
    level: logLevelSchema.parse(logLevel),
    prettyPrint: pretty,
    serializers: {
      req: serializers.req,
      res: serializers.res,
      err: serializers.err
    },
    redact: {
      paths: ['req.headers.authorization', 'req.headers.cookie']
    }
  })
}
exports.configureLogger = configureLogger
