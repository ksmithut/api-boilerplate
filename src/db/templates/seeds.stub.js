import * as uuid from 'uuid'

/**
 * @param {import('knex').Knex} knex
 */
export async function seed (knex) {
  await knex('table_name').del()
  await knex('table_name').insert([
    { id: uuid.v4() },
    { id: uuid.v4() },
    { id: uuid.v4() }
  ])
}
