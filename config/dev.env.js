'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://118.31.172.237:9031/api"',
  COOKIES_NAME: '"tsl_cookie"',
  DOMAIN_NAME: '""'
})
