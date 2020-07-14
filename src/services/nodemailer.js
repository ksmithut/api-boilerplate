'use strict'

const nodemailer = require('nodemailer')

/**
 * @param {object} params
 * @param {string} params.smtpURI
 */
function configureNodemailer ({ smtpURI }) {
  return nodemailer.createTransport(smtpURI)
}
exports.configureNodemailer = configureNodemailer
