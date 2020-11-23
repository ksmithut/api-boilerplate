import z from 'zod'
import { logLevelSchema } from './utils/logger.js'

const envSchema = z.object({
  NAME: z.string().default('api-boilerplate'),
  PORT: z
    .string()
    .regex(/^[1-9]\d*$/)
    .default('3000'),
  LOG_LEVEL: logLevelSchema.default('info')
})

export const configSchema = z.object({
  name: z.string(),
  port: z
    .number()
    .int()
    .min(1)
    .max(65535),
  logLevel: logLevelSchema
})

const schema = envSchema.transform(configSchema, env => ({
  name: env.NAME,
  port: Number.parseInt(env.PORT, 10),
  logLevel: env.LOG_LEVEL
}))

/** @typedef {import('zod').infer<typeof configSchema>} Config */

/**
 * @param {NodeJS.ProcessEnv} env
 * @returns {Config}
 */
export function getConfig (env) {
  return schema.parse(env)
}
