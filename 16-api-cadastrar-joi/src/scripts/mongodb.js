// docker ps
// docker exec -it 72d8e5e1318d mongo -u julioceron -p secret123 --authenticationDatabase herois

show dbs

use herois

show collections
db.herois.insert({
    nome: 'Flash',
    poder: 'Velocidade',
    dataNascimento: '1998-01-01'
})

db.herois.find()
db.herois.find().pretty()

for(let i=0; i<=100; i++) {
    db.herois.insert({
        nome: `Clone-${i}`,
        poder: 'Velocidade',
        dataNascimento: '1998-01-01'
    })
}

db.herois.count()
db.herois.findOne()
db.herois.find().limit(1000).sort({nome: -1})
db.herois.find({}, {poder: 1, _id: 0})


db.herois.update({_id: ObjectId("5ca94bacc75d7c8c9605bf78")},
    {nome: 'Mulher Maravilha'}
)

db.herois.update({_id: ObjectId("5ca94c35c75d7c8c9605bf89")},
    {$set: {nome: 'Lanterna Verde'}}
)

db.herois.update({poder: 'Velocidade'},
    {$set: {poder: 'Super Força'}}
)

db.herois.remove({}) //remove tudo
