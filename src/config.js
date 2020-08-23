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
    JSON_WEB_KEYS = 'RS512:-----BEGIN PRIVATE KEY-----\nMIIBVQIBADANBgkqhkiG9w0BAQEFAASCAT8wggE7AgEAAkEAtqqMBPVBCCKmAo97\nzPEJWv5CcXPOgjFffcjEi0VTZcG6s4BPsJ5OCBVfLXHAG+Y91AMsN3xqRgxwCu7l\n1UdAfQIDAQABAkA2nZmN5fKSxyFRxKrkZPFCJqGhIFoPbUm65yt05L6BvsBp0GXT\ncQOWmi4b6nN6rJRHixHwsoH+7dKusWV893JhAiEA4q+bUcQMAYPU5eQuVfnpvVeu\n94fEdZbRTSmXxcNcwGkCIQDOSay9mKjwe1hH+rLnAI2prTZBahDJJc6qkzaXl8a8\n9QIgD+IeD+ycqr6B/FmwpXWNWyb5q35n1ZVrtOxlJgY6SYECIQCyvIM/g5ZdR4Im\nW8HHBWO5MKth4lTI9Eks4oDauFcqQQIhAKBWtbJitoGcSYTjpkFrWuNIGOc7tOfs\nq7WEUIfImdaC\n-----END PRIVATE KEY-----\n'
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
