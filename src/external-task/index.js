'use strict'

const utils = require('fvi-node-utils')
const { Client, Variables, logger } = require('camunda-external-task-client-js')

const { toCamundaVars } = require('../utils')

const MAX_TASKS = 10
const PARALLEL = 1
const RETRIES = 1

const INTERVAL = 10000
const LOCK = 30000
const RETRY_TIMEOUT = 15000

const logPrefix = '[Camunda External Service]'

const setEvents = client => {
    client.on('subscribe', (topic, topicSubscription) => {
        utils.debug.here(
            `${logPrefix}[ClientCamundaExternalTask]: Subscribe Topic topic=${utils.objects.inspect(
                topic
            )}; lockDuration=${topicSubscription.lockDuration}`
        )
    })

    client.on('unsubscribe', (topic, _topicSubscription) => {
        utils.debug.here(
            `${logPrefix}[ClientCamundaExternalTask]: Unsubscribe Topic topic=${utils.objects.inspect(
                topic
            )}`
        )
    })

    client.on('poll:start', () => {
        utils.debug.here(`${logPrefix}[ClientCamundaExternalTask]: msg=Poll Started!`)
    })

    client.on('poll:stop', () => {
        utils.debug.here(`${logPrefix}[ClientCamundaExternalTask]: msg=Poll Stoped!`)
    })

    client.on('poll:success', tasks => {
        utils.debug.here(
            `${logPrefix}[ClientCamundaExternalTask]: msg=Poll Fetched Success!; tasks=${utils.objects.inspect(
                tasks.map(t => t.id)
            )}`
        )
    })

    client.on('poll:error', error => {
        utils.debug.here(
            `${logPrefix}[ClientCamundaExternalTask]: msg=Poll Error!; error=${utils.objects.inspect(
                error
            )}`
        )
    })

    client.on('complete:success', task => {
        utils.debug.here(
            `${logPrefix}[ClientCamundaExternalTask]: msg=Complete Success!; task=${utils.objects.inspect(
                task.id
            )}`
        )
    })
    client.on('complete:error', (task, error) => {
        utils.debug.here(
            `${logPrefix}[ClientCamundaExternalTask]: msg=On Complete Error!; task=${utils.objects.inspect(
                task.id
            )}; error=${utils.objects.inspect(error)}`
        )
    })
    client.on('handleFailure:success', task => {
        utils.debug.here(
            `${logPrefix}[ClientCamundaExternalTask]: msg=Handle Failure!; task=${utils.objects.inspect(
                task.id
            )}`
        )
    })
    client.on('handleFailure:error', (task, error) => {
        utils.debug.here(
            `${logPrefix}[ClientCamundaExternalTask]: msg=On Handle Failure With Error!; task=${utils.objects.inspect(
                task.id
            )}; error=${utils.objects.inspect(error)}`
        )
    })
    client.on('handleBpmnError:success', task => {
        utils.debug.here(
            `${logPrefix}[ClientCamundaExternalTask]: msg=Handle BPMN ERROR!; task=${utils.objects.inspect(
                task.id
            )}`
        )
    })
    client.on('handleBpmnError:error', (task, error) => {
        utils.debug.here(
            `${logPrefix}[ClientCamundaExternalTask]: msg=On Handle BPMN ERROR with Error!; task=${utils.objects.inspect(
                task.id
            )}; error=${utils.objects.inspect(error)}`
        )
    })
    client.on('extendLock:success', task => {
        utils.debug.here(
            `${logPrefix}[ClientCamundaExternalTask]: msg=Extend Lock Success!; task=${utils.objects.inspect(
                task.id
            )}`
        )
    })
    client.on('extendLock:error', (task, error) => {
        utils.debug.here(
            `${logPrefix}[ClientCamundaExternalTask]: msg=On Extend Lock Error!; task=${utils.objects.inspect(
                task.id
            )}; error=${utils.objects.inspect(error)}`
        )
    })
    client.on('unlock:success', task => {
        utils.debug.here(
            `${logPrefix}[ClientCamundaExternalTask]: msg=Unlock Success!; task=${utils.objects.inspect(
                task.id
            )}`
        )
    })
    client.on('unlock:error', (task, error) => {
        utils.debug.here(
            `${logPrefix}[ClientCamundaExternalTask]: msg=On Unlock Error!; task=${utils.objects.inspect(
                task.id
            )}; error=${utils.objects.inspect(error)}`
        )
    })

    return client
}

const start = (baseUrl, isMock = false) => {
    const clients = new Map()

    return (
        workerId,
        maxTasks = MAX_TASKS,
        maxParallelExecutions = PARALLEL,
        interval = INTERVAL,
        lockDuration = LOCK
    ) => {
        const configExternalTask = { baseUrl: `${baseUrl}/engine-rest`, use: logger }
        const opts = {
            ...configExternalTask,
            workerId,
            maxTasks,
            maxParallelExecutions,
            interval,
            lockDuration,
        }

        utils.debug.here(
            `${logPrefix}: Start Worker id=${workerId}; opts: ${utils.objects.inspect(opts)}`
        )

        if (clients.has(workerId)) {
            utils.debug.here(`${logPrefix}[warn]: Worker Already started!; workerId=${workerId}`)
            return clients.get(workerId)
        }

        if (isMock) {
            const client = {
                stop: () => {},
                subscribe: (topicId, filters, _callbackIgnored) => {
                    utils.debug.here(
                        `${logPrefix}[mock][subscribe]: topicId=${topicId}; filters: ${utils.objects.inspect(
                            filters
                        )}`
                    )
                },
            }
            clients.set(workerId, client)
            return client
        } else {
            const client = new Client(opts)
            // TODO paulosales: MaxListenersExceededWarning: Possible EventEmitter memory leak detected
            // setEvents(client)
            clients.set(workerId, client)
            return client
        }
    }
}

const toVariables = (initial, vars) => {
    const camundaVars = toCamundaVars(vars)
    const keys = Object.keys(camundaVars)
    const variables = new Variables(initial)

    for (let i = 0; i < keys.length; i++) {
        variables.setTyped(keys[i], camundaVars[keys[i]])
    }

    return variables
}

module.exports = (baseUrl, isMock) => {
    return {
        start: start(baseUrl, isMock),
        toVariables,
        setEvents,
        defaults: {
            INTERVAL,
            LOCK,
            MAX_TASKS,
            PARALLEL,
            RETRIES,
            RETRY_TIMEOUT,
        },
    }
}
