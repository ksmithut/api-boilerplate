'use strict'

const { JWK, JWKS, JWT } = require('jose')
const z = require('zod')

const keysSchema = z
  .array(
    z.object({
      algorithm: z.string(),
      key: z.string()
    })
  )
  .min(1, 'You need at least one key')

/** @typedef {ReturnType<configureJWT>} JWTService */

/**
 * @param {import('zod').infer<typeof keysSchema>} keys
 */
function configureJWT (keys) {
  const allKeys = keysSchema.parse(keys).map(({ algorithm, key }) => {
    return JWK.asKey(key, {
      alg: algorithm,
      use: 'sig'
    })
  })
  const keyStore = new JWKS.KeyStore(allKeys)
  const signingKey = allKeys[0]

  return {
    /**
     * @param {object} payload
     * @param {import('jose').JWT.SignOptions} [options]
     */
    sign (payload, options) {
      return JWT.sign(payload, signingKey, options)
    },
    /**
     * @param {string} token
     * @param {import('jose').JWT.VerifyOptions} [options]
     */
    verify (token, options) {
      return JWT.verify(token, keyStore, options)
    },
    jwks () {
      return keyStore.toJWKS()
    }
  }
}
exports.configureJWT = configureJWT
