const assert = require('assert')
const api = require('./../api')

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvcmdlIiwiaWQiOjEsImlhdCI6MTU1NTIwODkwNn0.GTAxQtLU41fwtyCYHJdsgAJzu50GbCmtoBo2t2McS9s'
const headers = {
    Authorization: TOKEN
}


const DEFAULT_CADASTRAR = {
    nome: 'Chapolin Colorado',
    poder: 'Marreta Bionica'
}

const MOCK_HEROI_INICIAL = {
    nome: 'gavião negro',
    poder: "flechas"
}

let MOCK_ID = ''

describe('Suite de testes da API Heroes', function() {
    this.beforeAll(async() => {
        app = await api
        const result = await app.inject({
            method: 'POST',
            url: '/herois',
            headers,
            payload: JSON.stringify(MOCK_HEROI_INICIAL)
        })
        const dados = JSON.parse(result.payload)
        MOCK_ID = dados._id
    })

    it('listar /herois', async() => {
        const result = await app.inject({
            method: 'GET',
            url: '/herois',
            headers
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
            url: `/herois?skip=${SKIP}&limit=${TAMANHO_LIMITE}`,
            headers,
        })
        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode
        assert.ok(dados.length === TAMANHO_LIMITE)
        assert.deepEqual(statusCode, 200)
    })

/*     it('listar /herois - deve filtrar um item', async() => {
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
    }) */

    it('listar /herois - deve retornar um erro com limit incorreto', async() => {
        const TAMANHO_LIMITE = "aaaeee"
        const SKIP = 1

        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`,
            headers
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
            headers,
            payload: JSON.stringify(DEFAULT_CADASTRAR)
        })

        const statusCode = result.statusCode
        const { message, _id } = JSON.parse(result.payload)
        assert.ok(statusCode === 200)
        assert.notStrictEqual(_id, undefined)
        assert.deepEqual(message, "Heroi cadastrado com sucesso!")
    })

    it('atualizar PATCH - /herois/:id', async () => {
        const _id = '5caa9a4e24f65d3adc2f09af'

        const result = await app.inject({
            method: 'PATCH',
            url: `/herois/${_id}`,
            headers,
            payload: JSON.stringify({
                poder: 'Super Mira'
            })
        })

        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)
        const expected = { 
            statusCode: 412,
            error: 'Precondition Failed',
            message: 'ID Não encontrado no banco!' 
        }
        assert.ok(statusCode === 412)
        assert.deepEqual(dados, expected)
    })

    it('remover DELETE - /herois/:id', async () => {
        const _id = MOCK_ID

        const result = await app.inject({
            method: 'DELETE',
            headers,
            url: `/herois/${_id}`
        })

        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)
        assert.ok(statusCode === 200)
        assert.deepEqual(dados.message, "Heroi removido com sucesso!")
    })

    it('remover DELETE - /herois/:id - não deve remover' , async () => {
        const _id = '5caa9a4e24f65d3adc2f09af'

        const result = await app.inject({
            method: 'DELETE',
            headers,
            url: `/herois/${_id}`
        })

        const expected = { 
            statusCode: 412,
            error: 'Precondition Failed',
            message: 'ID não encontrado no banco!' 
        }

        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)
        assert.ok(statusCode === 412)
        assert.deepEqual(dados, expected)
    })
    
})