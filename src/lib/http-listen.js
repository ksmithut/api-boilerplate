import { once } from 'events'
import { promisify } from 'util'

/**
 * @param {import('http').Server} server
 * @param {number} port
 */
async function httpListen (server, port) {
  await once(server.listen(port), 'listening')
  return promisify(server.close.bind(server))
}

exports.httpListen = httpListen
