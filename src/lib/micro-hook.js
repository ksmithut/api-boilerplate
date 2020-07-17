'use strict'

/** @typedef {import('http').IncomingMessage} Req */
/** @typedef {import('http').ServerResponse} Res */

/** @type {WeakMap<Req, Res>} */
const resMap = new WeakMap()
/** @type {WeakMap<Req, bigint>} */
const startMap = new WeakMap()

/**
 * @param {import('micro').RequestHandler} handler
 * @returns {import('micro').RequestHandler}
 */
function initHooks (handler) {
  return async (req, res) => {
    const start = process.hrtime.bigint()
    resMap.set(req, res)
    startMap.set(req, start)
    return handler(req, res)
  }
}
exports.initHooks = initHooks

/**
 * @param {Req} req
 */
function useResponse (req) {
  const res = resMap.get(req)
  if (res) return res
  throw new ReferenceError('Hooks have not been initialized with initHooks')
}
exports.useResponse = useResponse

/**
 * @param {Req} req
 */
function useStart (req) {
  const start = startMap.get(req)
  if (start) return start
  throw new ReferenceError('Hooks have not been initialized with initHooks')
}
exports.useStart = useStart

/**
 * @param {Req} req
 */
function useDuration (req) {
  return process.hrtime.bigint() - useStart(req)
}
exports.useDuration = useDuration

/**
 * @template TValue
 * @param {(req: Req) => TValue} func
 * @returns {(req: Req) => TValue}
 */
function createHook (func) {
  /** @typedef {WeakMap<Req, TValue>} */
  const valueMap = new WeakMap()
  return req => {
    let value = valueMap.get(req)
    if (value === undefined) {
      value = func(req)
      valueMap.set(req, value)
    }
    return value
  }
}
exports.createHook = createHook
