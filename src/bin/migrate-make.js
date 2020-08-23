#!/usr/bin/env node
'use strict'

require('dotenv').config()
const { getConfig } = require('../config')
const { configureLogger } = require('../services/logger')
const { configureKnex } = require('../services/knex')

const { name, logLevel, postgresURI } = getConfig(process.env)

const [migrationName] = process.argv.slice(2)
const logger = configureLogger({ name, logLevel, pretty: true })

const knex = configureKnex(postgresURI)

knex.migrate
  .make(migrationName)
  .then(file => {
    logger.info(`Migration file created: ${file}`)
  })
  .catch(err => {
    logger.error(err)
    process.exit(1)
  })
