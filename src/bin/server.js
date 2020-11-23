#!/usr/bin/env node
import dotenv from 'dotenv'
import process from 'process'
import { Command } from 'commander'
import { configureApp } from '../index.js'
import { once } from '../lib/once.js'
import { getConfig } from '../config.js'

dotenv.config()

const program = new Command()
const app = configureApp(getConfig(process.env))

program
  .command('start', { isDefault: true })
  .description('Starts the server')
  .option('-m,--migrate', 'Run migrations before starting', false)
  .action(async ({ migrate }) => {
    if (migrate) await app.migrateUp()
    const close = await app.start()
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

program
  .command('migrate:up')
  .description('Run migrations')
  .action(async () => {
    await app.migrateUp()
  })

program
  .command('migrate:down')
  .description('Rollback the most recently run migration batch')
  .option('-a, --all', 'Run all migrations down', false)
  .action(async ({ all }) => {
    await app.migrateDown({ all })
  })

program
  .command('seed:run')
  .description('Run the seed scripts')
  .action(async () => {
    await app.seedRun()
  })

program.parseAsync(process.argv).catch(err => {
  console.error(err)
  process.exit(1)
})
