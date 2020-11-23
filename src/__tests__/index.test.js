import { describe, test, beforeAll, afterAll } from '@jest/globals'
import supertest from 'supertest'
import { configureApp } from '../index.js'

const TEST_PORT = 3001
const TEST_HOST = `http://localhost:${TEST_PORT}`
const request = supertest(TEST_HOST)

describe('server', () => {
  /** @type {() => Promise<void>} */
  let close
  beforeAll(async () => {
    const app = await configureApp({
      name: 'test',
      port: TEST_PORT,
      logLevel: 'fatal'
    })
    await app.migrateUp()
    close = await app.start()
  })
  afterAll(async () => {
    await close()
  })

  test('Returns 404 on unhandled routes', async () => {
    await request.get('/foobar').expect(404, { code: 'ROUTE_NOT_FOUND' })
  })
})
