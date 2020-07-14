'use strict'

const uuid = require('uuid')

/**
 * @param {import('knex')} knex
 */
exports.seed = async knex => {
  await knex('table_name').del()
  await knex('table_name').insert([
    { id: uuid.v4() },
    { id: uuid.v4() },
    { id: uuid.v4() }
  ])
}
