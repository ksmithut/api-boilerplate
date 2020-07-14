'use strict'

const { name } = require('../package.json')

/** @typedef {ReturnType<getConfig>} Config */

/**
 * @param {NodeJS.ProcessEnv} env
 */
function getConfig (env) {
  const {
    NAME = name,
    PORT = '3000',
    LOG_LEVEL = 'info',
    POSTGRES_URI = 'postgres://postgres:postgres@localhost:5432/postgres',
    SMTP_URI = 'smtp://localhost:1025/?ignoreTLS=true',
    JSON_WEB_KEYS = 'RS256:-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDKquIqSei4lyLR\nKyoBz96tPTXVVeYC4GKUb/Cl+PrOszEM2rajb/sMNzqUvc9ZqDcI1snPWfiGlqDx\niV8On1ZugJh7kJtkPACnLgEMi8W9lhdAkHamw+cOwRLkxmqklYfDua23ktz2A707\nXc6yFZu1Lp0PtGONlhzWDYmNb2GBvDd1jj6BUvgHBJGIR5fPCtEAVJ8IsJh6svXa\n541s0yit35mk+piGd+Y7iD6AEGItOp4ojsLcyI38U2FP4DUUGBkq8u/PDJhWzsH/\n6qyXQN6xfHczZXfP0KaVxsPtUuEgeVnGKffWc4Ku8dwz0pZk4xFzmMXiLyRTPhLU\n+gIaoF7BAgMBAAECggEBAKigUDfBcSoNToHdOUFytKNN97m+k/e2vS8miIOASyaq\nv9gjLq2EIc0DMvHJkHnX1Zq8JAQrpvZM5DK0Cux+tQqSYs0E/9YBesWfKG5I6cmZ\n1VT6Hk8ZVunWyaKiWN8CL4kxuBGy17i2Wb/IiI9yHTE+TJ5hiCepS+rqLpYIo4eu\nFrXQOZ1Swjmt9W1OzWx/iRwDE7c3/mkZhz/obKduAL8oDTcLUfR6DXzm2NTaz5PE\n9Ixp742PwTS8uy+am1v/0oa/W9wAy/n0nXb7cy+c3ixWPGY71KlhS47b1Rj3nvC5\n/bWTDNHapYAvpTiB7Sakg+FuPiPyMJm6016GZcvF7YUCgYEA/yi7DXMhHI4gSanT\nnzhHKEAOKMWTY0yGMnNXX2d/dCtW04lHnbSWMkVKJLr1XvhKNehLRkYxXOgK7ndI\nJaGvWivFFglt4sPOb2ebuZNDcDFIps4MpFuFzllaAQ3fDNy//SkBkHCZ0UUNmjAq\nwNqdkLKtXh/6H2UseiZZZPY//R8CgYEAy1XeCztieTuHzZVkafYFXTImdFX/a9ms\noe8CHS+lpX2bEUtOW3GFmf7VGC4I6+/YDdeuXOCogJntwXx6seHk/+KL3pxMYw5H\nJUmuXojRecgEHKe6yrT7RNpgu8VJBdqCpt0H8UrgeHeUsaxpkbxig5gbhhhffELw\nPCzWYtBQSB8CgYBh/+/P258lC4VlJX/tED1sPSXzDOdt5Q9JwzkUoHi4Uoj3mCtU\na+6gAjLW5qOlRTGjgMOgiwccitbf/hpMscvakyMQMrDsvo3EBgQug1wMdDFWN59t\nZOWAeprx+rTniMWIYz6Bjm3VjXMK/GL/TTflQmsJ0rhLZJ1vkNkWyOmMuwKBgBUL\ngxrIf62qgqi9gJIS+4UkzqQVzoTcF6j+8soQh2V0dZs5nxeJzVkd7fI9uYCp50Ov\nggVs3yPISrpO5ugISEpPqUhWBvXtoWFzmc+A+6VOFVbd6VBXoPYEYCSvC5rGfeVF\nVTAdHtR5E/O7s4V46P1Tve2IEkHrL7Aat+msQ9LjAoGBAN5P8vLfgCeyMC6UyUAT\nFuNva7rvQhlbfczxUO38wngl3ZwDAiWemv5Pjdhg/fWlW7ycXjAT4gh3Bgb/s5As\np9VAu/AbhiK/hthuXLlJn8TH/EAW4llAYnCbxWbPO0gZ6c2EnCj6gBgwqLZXIjnt\nK74BSnTgFLfZmD1Ws0UmPbcY\n-----END PRIVATE KEY-----'
  } = env
  const jsonWebKeys = JSON_WEB_KEYS.split(',').map(line => {
    const [algorithm, ...keyParts] = line.split(':')
    return { algorithm, key: keyParts.join(':') }
  })
  return {
    name: NAME,
    port: Number(PORT),
    logLevel: LOG_LEVEL,
    postgresURI: POSTGRES_URI,
    smtpURI: SMTP_URI,
    jsonWebKeys
  }
}

exports.getConfig = getConfig
