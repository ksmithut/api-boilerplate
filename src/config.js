import { z } from 'zod'
import { logLevelSchema } from './utils/logger.js'

const envSchema = z.object({
  NAME: z.string(),
  PORT: z.string().regex(/^\d*$/),
  LOG_LEVEL: logLevelSchema,
  POSTGRES_URL: z.string().url()
})

export const configSchema = z.object({
  name: z.string(),
  port: z
    .number()
    .int()
    .min(1)
    .max(65535),
  logLevel: logLevelSchema,
  postgresURL: z.string().url()
})

const schema = envSchema.transform(env =>
  configSchema.parse({
    name: env.NAME,
    port: Number.parseInt(env.PORT, 10),
    logLevel: env.LOG_LEVEL,
    postgresURL: env.POSTGRES_URL
  })
)

/** @typedef {import('zod').infer<typeof configSchema>} Config */

/**
 * @param {NodeJS.ProcessEnv} env
 * @returns {Config}
 */
export function getConfig (env) {
  return schema.parse(env)
}
