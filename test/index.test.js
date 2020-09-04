'use strict'

const chai = require('chai')

const koa = require('fvi-koa-server')
const Router = require('koa-router')
const { toConfig, inspect } = require('fvi-node-utils/src/objects')

const app = require('../src')

const router = new Router()

router.get(`/engine-rest/task/:taskId/variables`, ctx => {
    ctx.body = {
        id: { value: ctx.params.taskId },
        msg: { value: `Geting taks variables id=${inspect(ctx.params)}` },
    }
})
router.get(`/engine-rest/task`, ctx => {
    ctx.body = ctx.query
})
router.get(`/engine-rest/task/:taskId`, ctx => {
    ctx.body = {
        processInstanceId: ctx.params.taskId,
        msg: `Getting task by id=${inspect(ctx.params)}`,
    }
})
router.post(`/post/test`, ctx => {
    ctx.body = 'OK'
})
router.put(`/put/test`, ctx => {
    ctx.body = 'OK'
})
router.delete(`/delete/test`, ctx => {
    ctx.body = 'OK'
})
router.post(`/engine-rest/task/:taskId/claim`, ctx => {
    ctx.body = { id: ctx.params.taskId, msg: `Task claim id=${inspect(ctx.params)}` }
})
router.post(`/engine-rest/task/:taskId/complete`, ctx => {
    ctx.body = { id: ctx.params.taskId, msg: `Task complete id=${inspect(ctx.params)}` }
})
router.get(`/engine-rest/process-instance/:processId`, ctx => {
    ctx.body = {
        id: ctx.params.processId,
        msg: `Getting process instance by id=${inspect(ctx.params)}`,
    }
})
router.post(`/engine-rest/task/:taskId/variables`, ctx => {
    ctx.body = { id: ctx.params.taskId, msg: `Task variables updated id=${inspect(ctx.params)}` }
})
router.post(`/engine-rest/process-definition/key/:processKey/tenant-id/:tenantId/start`, ctx => {
    ctx.body = ctx.params
})
router.post(`/engine-rest/process-definition/key/:processKey/start`, ctx => {
    ctx.body = ctx.params
})

const testTaskId = res => {
    chai.assert.exists(res.data, 'res.data is null!')
    chai.assert.exists(res.data.id, 'res.data.id is null!')
    chai.assert.equal('testing-id', res.data.id, 'res.data.id is invalid!')
}

describe('Testing Camunda Client', () => {
    let server

    before(() =>
        koa(toConfig({ server: { name: 'test-server', version: '1.0.0', port: 9991 } }))
            .then(s => {
                server = s
                server.use(router.routes(), router.allowedMethods())
            })
            .catch(e => {
                throw e
            })
    )
    after(() => server.instance.close())

    describe('Testing core client with ./config module', () => {
        it('Testing get /support/health is OK?', done => {
            app()
                .get('/support/health')
                .then(res => {
                    try {
                        chai.assert.exists(res.data, 'res.data is null!')
                        chai.assert.exists(res.data.server, 'res.data.server is null!')
                        done()
                    } catch (e) {
                        done(e)
                    }
                })
                .catch(done)
        })
        it('Testing get /support/ping is OK?', done => {
            app()
                .get('/support/ping')
                .then(res => {
                    chai.assert.exists(res.data, 'res.data is null!')
                    done()
                })
                .catch(done)
        })
        it('Testing get /post/test is OK?', done => {
            app()
                .post('/post/test')
                .then(res => {
                    chai.assert.exists(res.data, 'res.data is null!')
                    chai.assert.equal('OK', res.data, 'res.data is invalid!')
                    done()
                })
                .catch(done)
        })
        it('Testing get /put/test is OK?', done => {
            app()
                .put('/put/test')
                .then(res => {
                    chai.assert.exists(res.data, 'res.data is null!')
                    chai.assert.equal('OK', res.data, 'res.data is invalid!')
                    done()
                })
                .catch(done)
        })
        it('Testing get /delete/test is OK?', done => {
            app()
                .delete('/delete/test')
                .then(res => {
                    chai.assert.exists(res.data, 'res.data is null!')
                    chai.assert.equal('OK', res.data, 'res.data is invalid!')
                    done()
                })
                .catch(done)
        })
    })

    describe('Testing core client', () => {
        it('Testing get /support/health is OK?', done => {
            app({ url: 'http://localhost:9991' })
                .get('/support/health')
                .then(res => {
                    try {
                        chai.assert.exists(res.data, 'res.data is null!')
                        chai.assert.exists(res.data.server, 'res.data.server is null!')
                        done()
                    } catch (e) {
                        done(e)
                    }
                })
                .catch(done)
        })
        it('Testing get /support/ping is OK?', done => {
            app({ url: 'http://localhost:9991' })
                .get('/support/ping')
                .then(res => {
                    chai.assert.exists(res.data, 'res.data is null!')
                    done()
                })
                .catch(done)
        })
        it('Testing get /post/test is OK?', done => {
            app({ url: 'http://localhost:9991' })
                .post('/post/test')
                .then(res => {
                    chai.assert.exists(res.data, 'res.data is null!')
                    chai.assert.equal('OK', res.data, 'res.data is invalid!')
                    done()
                })
                .catch(done)
        })
        it('Testing get /put/test is OK?', done => {
            app({ url: 'http://localhost:9991' })
                .put('/put/test')
                .then(res => {
                    chai.assert.exists(res.data, 'res.data is null!')
                    chai.assert.equal('OK', res.data, 'res.data is invalid!')
                    done()
                })
                .catch(done)
        })
        it('Testing get /delete/test is OK?', done => {
            app({ url: 'http://localhost:9991' })
                .delete('/delete/test')
                .then(res => {
                    chai.assert.exists(res.data, 'res.data is null!')
                    chai.assert.equal('OK', res.data, 'res.data is invalid!')
                    done()
                })
                .catch(done)
        })
    })

    describe('Testing camunda methods:', () => {
        it('Testing getProcessInstanceByTaskId method is OK?', done => {
            app({ url: 'http://localhost:9991' })
                .getProcessInstanceByTaskId('testing-id')
                .then(res => {
                    try {
                        testTaskId(res)
                        done()
                    } catch (e) {
                        done(e)
                    }
                })
                .catch(done)
        })

        it('Testing getTaskById method is OK?', done => {
            app({ url: 'http://localhost:9991' })
                .getTaskById('testing-id')
                .then(res => {
                    try {
                        chai.assert.exists(res.data, 'res.data is null!')
                        chai.assert.equal(
                            'testing-id',
                            res.data.processInstanceId,
                            'data.processInstanceId is invalid!'
                        )
                        done()
                    } catch (e) {
                        done(e)
                    }
                })
                .catch(done)
        })
        it('Testing getTaskVariables method is OK?', done => {
            app({ url: 'http://localhost:9991' })
                .getTaskVariables('testing-id')
                .then(res => {
                    try {
                        testTaskId(res)
                        done()
                    } catch (e) {
                        done(e)
                    }
                })
                .catch(done)
        })

        it('Testing getTasksByDefinitionKey method is OK?', done => {
            app({ url: 'http://localhost:9991' })
                .getTasksByTenantIdProcessDefAndTaskDef('tenantId', 'processDef', 'taskDef')
                .then(res => {
                    try {
                        chai.assert.exists(res.data, 'res.data is null!')
                        chai.assert.exists(res.data.tenantIdIn, 'res.data.tenantId is null!')
                        chai.assert.exists(
                            res.data.processDefinitionKey,
                            'res.data.processDefinitionKey is null!'
                        )
                        chai.assert.exists(
                            res.data.taskDefinitionKey,
                            'res.data.taskDefinitionKey is null!'
                        )
                        chai.assert.equal(
                            'tenantId',
                            res.data.tenantIdIn,
                            'data.tenantIdIn is invalid!'
                        )
                        chai.assert.equal(
                            'processDef',
                            res.data.processDefinitionKey,
                            'data.processDefinitionKey is invalid!'
                        )
                        chai.assert.equal(
                            'taskDef',
                            res.data.taskDefinitionKey,
                            'data.taskDefinitionKey is invalid!'
                        )
                        done()
                    } catch (e) {
                        done(e)
                    }
                })
                .catch(done)
        })

        it('Testing doTaskClaim method is OK?', done => {
            app({ url: 'http://localhost:9991' })
                .doTaskClaim('testing-id', 'user-name')
                .then(res => {
                    try {
                        testTaskId(res)
                        done()
                    } catch (e) {
                        done(e)
                    }
                })
                .catch(done)
        })

        it('Testing doTaskComplete method is OK?', done => {
            app({ url: 'http://localhost:9991' })
                .doTaskComplete('testing-id', { vars: 'vars' })
                .then(res => {
                    try {
                        testTaskId(res)
                        done()
                    } catch (e) {
                        done(e)
                    }
                })
                .catch(done)
        })

        it('Testing doUpdateVariables method is OK?', done => {
            app({ url: 'http://localhost:9991' })
                .doUpdateVariables('testing-id', { testing: true })
                .then(res => {
                    try {
                        testTaskId(res)
                        done()
                    } catch (e) {
                        done(e)
                    }
                })
                .catch(done)
        })

        it('Testing doStartByProcessDefKey method is OK?', done => {
            app({ url: 'http://localhost:9991' })
                .doStartByProcessDefKey('processKey', { businessKey: 'bk01', testing: true })
                .then(res => {
                    try {
                        chai.assert.exists(res.data, 'res.data is null!')
                        chai.assert.exists(res.data.processKey, 'res.data.processKey is null!')
                        chai.assert.equal(
                            'processKey',
                            res.data.processKey,
                            'data.processKey is invalid!'
                        )
                        done()
                    } catch (e) {
                        done(e)
                    }
                })
                .catch(done)
        })

        it('Testing doStartWithTenantIdByProcessDefKey method is OK?', done => {
            app({ url: 'http://localhost:9991' })
                .doStartWithTenantIdByProcessDefKey('tenantId', 'processKey', { testing: true })
                .then(res => {
                    try {
                        chai.assert.exists(res.data, 'res.data is null!')
                        chai.assert.exists(res.data.tenantId, 'res.data.tenantId is null!')
                        chai.assert.exists(res.data.processKey, 'res.data.processKey is null!')
                        chai.assert.equal(
                            'tenantId',
                            res.data.tenantId,
                            'data.tenantId is invalid!'
                        )
                        chai.assert.equal(
                            'processKey',
                            res.data.processKey,
                            'data.processKey is invalid!'
                        )
                        done()
                    } catch (e) {
                        done(e)
                    }
                })
                .catch(done)
        })
    })

    describe('Testing camunda external task methods', () => {
        let client = app({ url: 'http://localhost:9991', mock: true })

        it('Testing camunda.externalTask exists', done => {
            chai.assert.exists(client, 'client is null!')
            chai.assert.exists(client.externalTask, 'client.externalTask is null!')
            done()
        })
        it('Testing externalTask.start() exists', done => {
            chai.assert.exists(client, 'client is null!')
            chai.assert.exists(client.externalTask.start, 'client.externalTask.start() is null!')
            chai.assert.equal(
                'function',
                typeof client.externalTask.start,
                'externalTask.start() is not a function!'
            )
            client.externalTask.start('worker-id')
            done()
        })
        it('Testing externalTask.start() twice or more always returns same instance', done => {
            client.externalTask.start('worker-id')
            client.externalTask.start('worker-id')
            done()
        })

        it('Testing externalTask.toVariables exists', done => {
            chai.assert.exists(client, 'client is null!')
            chai.assert.exists(
                client.externalTask.toVariables,
                'client.externalTask.toVariables is null!'
            )

            const result = client.externalTask.toVariables(
                { var1: 'var1', var2: 'var2', var3: true, var4: 1 },
                { var1: 'yyy', var2: 'xxx', var3: false, var4: 9999999 }
            )

            chai.assert.exists(result, 'toVariables result is null!')
            const allTyped = result.getAllTyped()
            chai.assert.equal(
                'string',
                allTyped.var1.type,
                'toVariables result.var1.type is invalid!'
            )
            chai.assert.equal(
                'boolean',
                allTyped.var3.type,
                'toVariables result.var1.type is invalid!'
            )
            chai.assert.equal(
                'long',
                allTyped.var4.type,
                'toVariables result.var1.type is invalid!'
            )
            done()
        })

        it('Testing externalTask.defaults exists', done => {
            chai.assert.exists(client, 'client is null!')
            chai.assert.exists(
                client.externalTask.defaults,
                'client.externalTask.defaults is null!'
            )
            chai.assert.exists(client.externalTask.defaults.INTERVAL, 'defaults.INTERNAL is null!')
            chai.assert.exists(client.externalTask.defaults.LOCK, 'defaults.LOCK is null!')
            chai.assert.exists(
                client.externalTask.defaults.MAX_TASKS,
                'defaults.MAX_TASKS is null!'
            )
            chai.assert.exists(client.externalTask.defaults.PARALLEL, 'defaults.PARALLEL is null!')
            chai.assert.exists(client.externalTask.defaults.RETRIES, 'defaults.RETRIES is null!')
            chai.assert.exists(
                client.externalTask.defaults.RETRY_TIMEOUT,
                'defaults.RETRY_TIMEOUT is null!'
            )
            done()
        })
        it('Testing externalTask.setEvents', done => {
            chai.assert.exists(client, 'client is null!')
            chai.assert.exists(
                client.externalTask.setEvents,
                'client.externalTask.setEvents is null!'
            )
            chai.assert.equal(
                'function',
                typeof client.externalTask.setEvents,
                'externalTask.setEvents() is not a function!'
            )

            const result = client.externalTask.setEvents({
                on: (event, cb) => {
                    switch (event) {
                        case 'subscribe':
                            cb('topicId', { lockDuration: 100 })
                            return
                        case 'poll:success':
                            cb(['task1', 'task2'])
                            return
                        case 'poll:error':
                            cb(new Error('PollError'))
                            return
                        case 'complete:success':
                        case 'complete:error':
                        case 'handleFailure:success':
                        case 'handleFailure:error':
                        case 'handleBpmnError:success':
                        case 'handleBpmnError:error':
                        case 'extendLock:success':
                        case 'extendLock:error':
                        case 'unlock:success':
                        case 'unlock:error':
                            cb({ id: 'task-id' })
                            return
                        default:
                            if (cb) cb()
                            return 'OK'
                    }
                },
            })
            chai.assert.exists(result, 'setEvents result is null!')
            chai.assert.equal('OK', result.on(), 'result.on() is invalid!')
            done()
        })
    })

    describe('Testing mocking', () => {
        describe('Testing externalTask', () => {
            it('Testing start worker id="worker-id"', done => {
                app({ url: 'http://localhost:8080', mock: true }).externalTask.start('worker-id')
                done()
            })

            it('Testing subscribe id="worker-id"', done => {
                const client = app({ url: 'http://localhost:8080', mock: true }).externalTask.start(
                    'worker-id'
                )
                const cb = () => {
                    return 'OK'
                }

                client.subscribe('topicId', { processDefinitionKey: 'test1' }, cb)
                done()
            })
        })
    })
})
