#!/usr/bin/env node
'use strict'

require('dotenv').config()
const { configureApp } = require('../index')
const { once } = require('../lib/once')
const { getConfig } = require('../config')

const app = configureApp(getConfig(process.env))

const [command = 'start'] = process.argv.slice(2)

/**
 * @param {any} err
 */
function handleError (err) {
  console.error(err)
  process.exit(1)
}

switch (command) {
  case 'start':
    app
      .start()
      .then(close => {
        const shutdown = once(() => {
          close()
            .then(() => process.exit())
            .catch(err => {
              console.error(err)
              process.exit(1)
            })
        })
        process.on('SIGINT', shutdown)
        process.on('SIGTERM', shutdown)
        process.on('SIGUSR2', shutdown)
      })
      .catch(handleError)
    break
  case 'migrate:latest':
    app.migrateLatest().catch(handleError)
    break
  case 'migrate:rollback':
    app.migrateRollback().catch(handleError)
    break
  case 'seed:run':
    app.seedRun().catch(handleError)
    break
  default:
    handleError(new ReferenceError(`unknown command ${command}`))
}
