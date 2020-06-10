'use strict'

const { joi } = require('fvi-node-utils/app/objects')

const schemaStartByProcessDefKey = joi.object({
    processDefinitionKey: joi.string().required(),
    vars: joi
        .object({
            businessKey: joi.string().required(),
        })
        .options({ stripUnknown: true }),
})

const schemaStartWithTenantIdByProcessDefKey = joi.object({
    processDefinitionKey: joi.string().required(),
    tenantId: joi.string().required(),
    vars: joi
        .object({
            businessKey: joi.string().required(),
        })
        .options({ stripUnknown: true }),
})

module.exports = {
    schemaStartByProcessDefKey,
    schemaStartWithTenantIdByProcessDefKey,
}
