const assert = require('assert')
const api = require('./../api')
const Context = require('./../db/strategies/base/contextStrategy')
const Postgres = require('../db/strategies/postgres/postgres')
const UsuarioSchema = require('./../db/strategies/postgres/schemas/usuarioSchema')

let app = {}
const USER = {
    username: 'jorge',
    password: '123'
}

const USER_DB = {
    ...USER,
    password: '$2b$04$0B03WLuhWYLRf8Wcc7IBUu2VxklYP41x9rE4.EaRlIRYhL.aKQim.'
}
describe('Auth test suite', function() {
    this.beforeAll(async () => {
        app = await api
        
        const connectionOnPostgres = await Postgres.connect()
        const model = await Postgres.defineModel(connectionOnPostgres, UsuarioSchema)
        const postgres = new Context(new Postgres(connectionOnPostgres, model))
        await postgres.update(null, USER_DB, true)
        
    })

    it('deve obter um token', async() => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: USER
        })

        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.deepEqual(statusCode, 200)
        assert.ok(dados.token.length > 10)
    })

    it('deve retornar não autorizado ao tentar usa um login errado', async() => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'jorgebastiao',
                password: '54654'
            }
        })

        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.deepEqual(statusCode, 401)
        assert.deepEqual(dados.error, "Unauthorized")
    })
})