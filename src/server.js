'use strict'

const http = require('http')

/**
 * @param {object} params
 * @param {import('pino').BaseLogger} params.logger
 * @param {import('knex')} params.knex
 * @param {import('nodemailer').Transporter} params.mail
 * @param {import('./services/jwt').JWTService} params.jwt
 */
function configureServer ({ logger, knex, mail, jwt }) {
  const server = http.createServer((req, res) => {
    res.on('finish', () => logger.info({ req, res }))
    res.end(`${req.method} ${req.url}`)
  })
  return server
}

exports.configureServer = configureServer
