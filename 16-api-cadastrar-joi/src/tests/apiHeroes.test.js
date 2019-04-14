const assert = require('assert')
const api = require('./../api')


const DEFAULT_CADASTRAR = {
    nome: 'Chapolin Colorado',
    poder: 'Marreta Bionica'
}

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
            url: `/herois?skip=${SKIP}&limit=${TAMANHO_LIMITE}&name=${NAME}`
        })
        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode
        assert.deepEqual(statusCode, 200)
        assert.ok(dados[0].nome, NAME)
    })

    it('listar /herois - deve retornar um erro com limit incorreto', async() => {
        const TAMANHO_LIMITE = "aaaeee"
        const SKIP = 1

        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`
        })

        const erroResult = {
            "statusCode": 400,
            "error": "Bad Request",
            "message": "child \"limit\" fails because [\"limit\" must be a number]",
            "validation":{
                "source": "query",
                "keys":["limit"]
            }
        }

        assert.deepEqual(result.statusCode, 400)
        assert.deepEqual(result.payload, JSON.stringify(erroResult))
    })

    it('cadastrar POST - /herois', async() => {
        const result = await app.inject({
            method: 'POST',
            url: '/herois',
            payload: JSON.stringify(DEFAULT_CADASTRAR)
        })

        const statusCode = result.statusCode
        const { message } = JSON.parse(result.payload)
        assert.ok(statusCode === 200)
        assert.notStrictEqual(_id, undefined)
        assert.deepEqual(message, "Heroi cadastrado com sucesso!")
    })
})