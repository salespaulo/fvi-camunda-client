'use strict'

const { inspect } = require('fvi-node-utils/src/objects')

const { toCamundaVars } = require('../utils')
const { schemaStartByProcessDefKey, schemaStartWithTenantIdByProcessDefKey } = require('../schema')

const getTasksByDefinitionKey = client => async (
    tenantId,
    processDefinitionKey,
    taskDefinitionKey
) => {
    return await client.get(
        `/engine-rest/task?tenantIdIn=${tenantId}&processDefinitionKey=${processDefinitionKey}&taskDefinitionKey=${taskDefinitionKey}`
    )
}

const doTaskClaim = client => async (taskId, username) => {
    return await client.post(`/engine-rest/task/${taskId}/claim`, {
        userId: username,
    })
}

const getTaskVariables = client => async taskId => {
    const resVariables = await client.get(`/engine-rest/task/${taskId}/variables`)
    const variables = resVariables.data

    if (!variables) {
        return { data: {} }
    }

    const vars = {}
    const keys = Object.keys(variables)

    for (let k in keys) {
        vars[`${keys[k]}`] = variables[`${keys[k]}`].value
    }

    return { data: vars }
}

const doTaskComplete = client => async (taskId, vars) => {
    const keys = Object.keys(vars || {})
    const variables = {}

    for (let k in keys) {
        const value = !vars[keys[k]] ? 'null' : vars[keys[k]].toString().substr(0, 4000)
        variables[`${keys[k]}`] = {
            value,
            type: 'String',
        }
    }

    return await client.post(`/engine-rest/task/${taskId}/complete`, {
        variables,
    })
}

const getTaskById = client => async taskId => {
    const resTask = await client.get(`/engine-rest/task/${taskId}`)
    return resTask
}

const getProcessInstanceByTaskId = client => async taskId => {
    const resTask = await client.get(`/engine-rest/task/${taskId}`)
    const task = resTask.data
    const resInstance = await client.get(`/engine-rest/process-instance/${task.processInstanceId}`)
    return resInstance
}

const doUpdateVariables = client => async (taskId, vars) => {
    const variables = toCamundaVars(vars)

    return await client.post(`/engine-rest/task/${taskId}/variables`, {
        modifications: variables,
    })
}

const doStart = client => async (processDefinitionKey, vars) => {
    const { value, error } = schemaStartByProcessDefKey.validate({
        processDefinitionKey,
        vars,
    })

    if (error != null) {
        new Error(`Invalid input schema error=${inspect(error)}`)
    }

    const variables = toCamundaVars(vars)

    return await client.post(`/engine-rest/process-definition/key/${processDefinitionKey}/start`, {
        businessKey: vars.businessKey,
        variables,
    })
}

const doStartWithTenantId = client => async (tenantId, processDefinitionKey, vars) => {
    const { value, error } = schemaStartWithTenantIdByProcessDefKey.validate({
        processDefinitionKey,
        tenantId,
        vars,
    })

    if (error != null) {
        new Error(`Invalid input schema error=${inspect(error)}`)
    }

    const variables = toCamundaVars(vars)

    return await client.post(
        `/engine-rest/process-definition/key/${processDefinitionKey}/tenant-id/${tenantId}/start`,
        {
            businessKey: vars.businessKey,
            variables,
        }
    )
}

module.exports = client => {
    return {
        ...client,
        // Tasks
        getTaskById: getTaskById(client),
        getTaskVariables: getTaskVariables(client),
        getTasksByTenantIdProcessDefAndTaskDef: getTasksByDefinitionKey(client),
        doTaskClaim: doTaskClaim(client),
        doTaskComplete: doTaskComplete(client),
        // Process
        getProcessInstanceByTaskId: getProcessInstanceByTaskId(client),
        doUpdateVariables: doUpdateVariables(client),
        doStartByProcessDefKey: doStart(client),
        doStartWithTenantIdByProcessDefKey: doStartWithTenantId(client),
    }
}
