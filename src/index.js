'use strict'

const axios = require('fvi-axios-client')

const camunda = require('./camunda')
const externalTask = require('./external-task')

const config = require('./config')

const getConfig = (cfg = null) => {
    if (cfg == null) {
        console.log('........')
        console.log('........ >>1 config', config)
        const camundaCfg = config.get('camunda')

        console.log('........ >> config', camundaCfg)
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
