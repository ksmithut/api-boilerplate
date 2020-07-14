'use strict'

const path = require('path')
const Knex = require('knex')

const DB_PATH = path.resolve(__dirname, '..', 'db')

/**
 * @param {string} postgresURI
 */
function configureKnex (postgresURI) {
  return Knex({
    client: 'pg',
    connection: postgresURI,
    migrations: {
      directory: path.join(DB_PATH, 'migrations'),
      stub: path.join(DB_PATH, 'templates', 'migrations.stub.js'),
      tableName: 'migrations'
    },
    seeds: {
      directory: path.join(DB_PATH, 'seeds'),
      stub: path.join(DB_PATH, 'templates', 'seeds.stub.js')
    }
  })
}

exports.configureKnex = configureKnex
