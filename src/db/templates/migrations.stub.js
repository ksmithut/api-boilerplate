'use strict'

/**
 * @param {import('knex').Knex} knex
 */
export async function up (knex) {
  await knex.schema.createTable('table_name', table => {
    table.uuid('id').primary()
    table.timestamps()
  })
}

/**
 * @param {import('knex').Knex} knex
 */
export async function down (knex) {
  await knex.schema.dropTableIfExists('table_name')
}
