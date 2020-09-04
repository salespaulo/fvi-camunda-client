const toCamundaVars = vars => {
    const keys = Object.keys(vars || {})
    const variables = {}

    for (let k in keys) {
        if (k === 'businessKey') {
            continue
        }

        const key = keys[k]
        let type = 'string'
        // check if is null or undefined
        let value = vars[key] == null ? 'null' : vars[key]

        const typeOfValue = typeof value

        switch (typeOfValue) {
            case 'boolean':
                type = 'boolean'
                break
            case 'number':
                type = 'long'
                break
            case 'object':
            case 'array':
                type = 'json'
                break
            default:
                if (value.toString().length > 3999) {
                    type = 'json'
                    value = JSON.stringify(value)
                } else {
                    type = 'string'
                }
        }

        variables[`${keys[k]}`] = {
            value,
            type,
        }
    }

    return variables
}

module.exports = {
    toCamundaVars,
}
