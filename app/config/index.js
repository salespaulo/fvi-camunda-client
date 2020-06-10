'use strict'

const { config } = require('fvi-node-utils')

module.exports = config({
    camunda: {
        url: {
            doc: 'Camunda Server URL',
            format: 'url',
            default: 'http://localhost:8080',
            env: 'CAMUNDA_URL',
            arg: 'camunda-url',
        },
        timeout: {
            doc: 'Camunda Client Timeout',
            format: Number,
            default: 1000,
            env: 'CAMUNDA_TIMEOUT',
            arg: 'camunda-timeout',
        },
        mock: {
            doc: 'Camunda Mock',
            format: Boolean,
            default: false,
            env: 'CAMUNDA_MOCK',
            arg: 'camunda-mock',
        },
    },
})
