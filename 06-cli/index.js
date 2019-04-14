const Commander = require('commander');
const Database = require('./database');
const Heroi = require('./Heroi');

async function main() {
	Commander.version('v1')
		.option('-n , --nome [value]', 'Nome do Heroi')
		.option('-p , --poder [value]', 'Poder do Heroi')
        .option('-c , --cadastrar', 'Cadastrar um Heroi')
        .option('-i , --id [value]', 'Id do Heroi')
        .option('-l, --listar', 'Listar todos os Herois')
        .option('-r, --remover [value]', 'Remove um heroi pelo id')
        .option('-a, --atualizar [value] ', 'Atualizar um heroi pelo id')
		.parse(process.argv);

	const heroi = new Heroi(Commander);

	try {
		if (Commander.cadastrar) {
            delete heroi.id
			const resultado = await Database.cadastrar(heroi);

			if (!resultado) {
				console.error('Heroi não foi cadastrado');
				return;
			} else {
				console.log('Heroi cadastrado com sucesso!');
			}
        }
        
        if(Commander.listar){
            const resultado = await Database.listar()
            console.log(resultado)
            return
        }

        if (Commander.remover) {
            const resultado = await Database.remover(Commander.remover)
            if (!resultado) {
                console.error("Não foi possível remover o heroi")
            } else {
                console.error("Heroi removido com sucesso")
            }
        }

        if (Commander.atualizar) {
            const idParaAtualizar = parseInt(Commander.atualizar)
            const dado = JSON.stringify(heroi)
            const heroiAtualizar = JSON.parse(dado)
            const resultado = await Database.atualizar(idParaAtualizar, heroiAtualizar)
            if (!resultado) {
                console.error('Não foi possível atualizar o heroi')
                return
            }
            console.log('Heroi Atualizar com sucesso')
        }
	} catch (error) {
		console.error('Error', error);
	}
}

main();
