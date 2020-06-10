'use strict'

const axios = require('fvi-axios-client')

const camunda = require('./camunda')
const externalTask = require('./external-task')

const getConfig = (cfg = null) => {
    if (cfg == null) {
        const config = require('./config')
        const camundaCfg = config.get('camunda')

        return camundaCfg
    }

    return cfg
}

module.exports = cfg => {
    const config = getConfig(cfg)
    const client = axios(config)
    const instance = camunda(client)

    instance.externalTask = externalTask(config.url, config.mock)

    return instance
}
