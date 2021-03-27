#!/usr/bin/env node
import dotenv from 'dotenv'
import { Command } from 'commander'
import { getConfig } from '../config.js'
import { configureLogger } from '../utils/logger.js'
import { configureKnex } from '../utils/knex.js'

dotenv.config()

const program = new Command()
const { name, logLevel, postgresURL } = getConfig(process.env)
const logger = configureLogger({ name, logLevel, pretty: true })
const knex = configureKnex(postgresURL)

program
  .arguments('<name>')
  .description('Creates a new seed file', {
    name: 'The name of the seed'
  })
  .action(async name => {
    const filename = await knex.seed.make(name)
    logger.info(`Seed file created: ${filename}`)
  })

program.parseAsync(process.argv).catch(err => {
  console.error(err)
  process.exit(1)
})
