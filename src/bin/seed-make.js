#!/usr/bin/env node
import dotenv from 'dotenv'
import { Command } from 'commander'
import { getConfig } from '../config.js'
import { configureLogger } from '../utils/logger.js'

dotenv.config()

const program = new Command()
const { name, logLevel } = getConfig(process.env)
const logger = configureLogger({ name, logLevel, pretty: true })

program
  .arguments('<name>')
  .description('Creates a new seed file', {
    name: 'The name of the seed'
  })
  .action(async name => {
    logger.info('No migration framework implemented')
  })

program.parseAsync(process.argv).catch(err => {
  console.error(err)
  process.exit(1)
})
