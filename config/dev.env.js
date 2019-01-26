'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://47.96.70.222:9030/api"',
  COOKIES_NAME: '"tsl_cookie"',
  DOMAIN_NAME: '""'
})
