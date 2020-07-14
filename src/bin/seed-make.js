#!/usr/bin/env node
'use strict'

const { getConfig } = require('../config')
const { configureLogger } = require('../services/logger')
const { configureKnex } = require('../services/knex')

const { name, logLevel, postgresURI } = getConfig(process.env)

const [seedName] = process.argv.slice(2)
const logger = configureLogger({ name, logLevel })
const knex = configureKnex(postgresURI)

knex.seed
  .make(seedName)
  .then(file => {
    logger.info(`Seed file created: ${file}`)
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
