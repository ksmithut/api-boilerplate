'use strict'

const { httpListen } = require('./lib/http-listen')
const { timeout } = require('./lib/timeout')
const { configureLogger } = require('./services/logger')
const { configureKnex } = require('./services/knex')
const { configureNodemailer } = require('./services/nodemailer')
const { configureJWT } = require('./services/jwt')
const { configureServer } = require('./server')

/**
 * @param {import('./config').Config} config
 */
function configureApp (config) {
  const { name, port, logLevel, postgresURI, smtpURI, jsonWebKeys } = config
  const logger = configureLogger({ name, logLevel })

  async function start () {
    const knex = configureKnex(postgresURI)
    const mail = configureNodemailer({ smtpURI })
    const jwt = configureJWT(jsonWebKeys)
    const server = configureServer({ logger, knex, mail, jwt })
    const closeServer = await httpListen(server, port)
    logger.info(`Server listening on port ${port}`)
    // Graceful shutdown function
    return async () => {
      await timeout(closeServer(), 10000)
      await Promise.all([knex.destroy(), mail.close()])
    }
  }

  async function migrateLatest () {
    const knex = configureKnex(postgresURI)
    const [, files] = await knex.migrate.latest().finally(() => knex.destroy())
    logger.info(`Ran ${files.length} migration(s)`)
    files.forEach(/** @param {string} file */ file => logger.info(`- ${file}`))
  }

  async function migrateRollback ({ all = false } = {}) {
    const knex = configureKnex(postgresURI)
    const [, files] = await knex.migrate
      .rollback(undefined, all)
      .finally(() => knex.destroy())
    logger.info(`Rolled back ${files.length} migration(s)`)
    files.forEach(/** @param {string} file */ file => logger.info(`- ${file}`))
  }

  async function seedRun () {
    const knex = configureKnex(postgresURI)
    const [files] = await knex.seed.run().finally(() => knex.destroy())
    logger.info(`Ran ${files.length} seed(s)`)
    files.forEach(/** @param {string} file */ file => logger.info(`- ${file}`))
  }

  return {
    start,
    migrateLatest,
    migrateRollback,
    seedRun
  }
}

exports.configureApp = configureApp
