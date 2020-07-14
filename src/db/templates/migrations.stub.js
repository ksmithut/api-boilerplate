'use strict'

/**
 * @param {import('knex')} knex
 */
exports.up = async knex => {
  await knex.schema.createTable('table_name', table => {
    table.uuid('id').primary()
    table.timestamps()
  })
}

/**
 * @param {import('knex')} knex
 */
exports.down = async knex => {
  await knex.schema.dropTableIfExists('table_name')
}
