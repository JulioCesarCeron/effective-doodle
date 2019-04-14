const assert = require('assert')
const api = require('./../api')

describe('Suite de testes da API Heroes', function() {
    this.beforeAll(async() => {
        app = await api
    })

    it('listar /herois', async() => {
        const result = await app.inject({
            method: 'GET',
            url: '/herois'
        })
        
        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode
        assert.deepEqual(statusCode, 200)
        assert.ok(Array.isArray(dados))
    })

    it('listar /herois - deve retornar somente 10 registros', async() => {
        const TAMANHO_LIMITE = 3
        const SKIP = 1

        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=${SKIP}&limit=${TAMANHO_LIMITE}`
        })
        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode
        assert.ok(dados.length === TAMANHO_LIMITE)
        assert.deepEqual(statusCode, 200)
    })

    it('listar /herois - deve filtrar um item', async() => {
        const TAMANHO_LIMITE = 1000
        const NAME = 'Clone-2'
        const SKIP = 1

        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=${SKIP}&limit=${TAMANHO_LIMITE}&nome=${NAME}`
        })
        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode
        assert.deepEqual(statusCode, 200)
        assert.ok(dados[0].nome, NAME)
    })
})