import { timeout } from './lib/timeout.js'
import { configureLogger } from './utils/logger.js'
import { configSchema } from './config.js'
import { configureServer } from './server.js'

/**
 * @param {import('./config').Config} config
 */
export function configureApp (config) {
  const { name, port, logLevel } = configSchema.parse(config)
  const logger = configureLogger({ name, logLevel })

  async function start () {
    const server = configureServer({ logger })
    await server.listen(port)
    const closeServer = async () => server.close()
    // Graceful shutdown function
    return async () => {
      await timeout(closeServer(), 10000)
    }
  }

  async function migrateUp () {
    logger.info('No migration framework implemented')
  }

  async function migrateDown ({ all = false } = {}) {
    logger.info('No migration framework implemented')
  }

  async function seedRun () {
    logger.info('No migration framework implemented')
  }

  return {
    start,
    migrateUp,
    migrateDown,
    seedRun
  }
}
