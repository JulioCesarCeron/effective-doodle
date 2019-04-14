const Mongoose = require('mongoose')

Mongoose.connect('mongodb://julioceron:secret123@localhost:27017/herois', 
{useNewUrlParser: true}, function (error) {
    if (!error) {
        return
    }
    console.log('Falha na conexão', error)
})
const connection = Mongoose.connection

function nomeFuncao() {

}
connection.once('open', () => { console.log("rodando") })
const state = connection.readyState
setTimeout(() => {
    const state = connection.readyState
    console.log('state', state);
}, 1000) 

/* 
0: Disconectdo
1: Conectado
2: Conectando
3: Disconectando
 */

 const heroiSchema = new Mongoose.Schema({
     nome:{
         type: String,
         required: true
     },
     poder:{
        type: String,
        required: true
     },
     insertedAt:{
        type: Date,
        default: new Date()
     }
 })

const model = Mongoose.model('herois', heroiSchema)

main = async() => {
    resultCadastrar = await model.create({
        nome: "Batman",
        poder: 'Dinheiro'
    })
    console.log('resultCadastrar', resultCadastrar);
    const listItens = await model.find()
    console.log('listItens', listItens);
}

main()