import Knex from 'knex'
import url from 'url'

/**
 * @param {string} path
 */
function relativePath (path) {
  return url.fileURLToPath(new URL(path, import.meta.url))
}

/**
 * @param {string} postgresURL
 */
export function configureKnex (postgresURL) {
  return Knex({
    client: 'pg',
    connection: postgresURL,
    migrations: {
      directory: relativePath('../db/migrations/'),
      stub: relativePath('../db/templates/migrations.stub.js'),
      tableName: 'migrations'
    },
    seeds: {
      directory: relativePath('../db/seeds/'),
      stub: relativePath('../db/templates/seeds.stub.js')
    }
  })
}
