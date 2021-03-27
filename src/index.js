import { timeout } from './lib/timeout.js'
import { configureLogger } from './utils/logger.js'
import { configureKnex } from './utils/knex.js'
import { configSchema } from './config.js'
import { configureServer } from './server.js'

/**
 * @param {import('./config').Config} config
 */
export function configureApp (config) {
  const { name, port, logLevel, postgresURL } = configSchema.parse(config)
  const logger = configureLogger({ name, logLevel })

  async function start () {
    const knex = configureKnex(postgresURL)
    const server = configureServer({ logger })
    await server.listen(port)
    // Graceful shutdown function
    return async () => {
      await timeout(Promise.resolve(server.close()), 10000)
      await timeout(knex.destroy(), 10000)
    }
  }

  async function migrateUp () {
    const knex = configureKnex(postgresURL)
    const [version, files] = await knex.migrate
      .latest()
      .finally(() => knex.destroy())
    logger.info({ version, files }, `${files.length} migration(s) run`)
  }

  async function migrateDown ({ all = false } = {}) {
    const knex = configureKnex(postgresURL)
    const [version, files] = await knex.migrate
      .rollback(undefined, all)
      .finally(() => knex.destroy())
    logger.info({ version, files }, `${files.length} migrations(s) rolled back`)
  }

  async function seedRun () {
    const knex = configureKnex(postgresURL)
    const [files] = await knex.seed.run().finally(() => knex.destroy())
    logger.info({ files }, `${files.length} seed(s) run`)
  }

  return {
    start,
    migrateUp,
    migrateDown,
    seedRun
  }
}
