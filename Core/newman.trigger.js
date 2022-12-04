const newman = require('../Core/newman.api')
const postmanApi = require('../Core/postman.api')
const sendMessage = require('../Core/telegram.api')

const executeCollection = async (postmanKey, filter) => {
    const collections = await postmanApi.getAllCollections(postmanKey, filter);
    for (const collectionId of collections) {
        await newman(`https://api.getpostman.com/collections/${collectionId}?apikey=${postmanKey}`, (error, summary) => {
            if(summary) {
                const name = summary.collection.name;
                const totalTests = summary.run.stats.assertions.total;
                const failTests = summary.run.stats.assertions.failed;
                const fails = summary.run.failures.map(x => `${x.source.name}: ${x.error.message}`);

                const message = `Коллекция: ${name}\n`
                    + `Всего проверок: ${totalTests}\n`
                    + `Тестов с ошибкой: ${failTests}\n`
                    + '***\n'
                    + fails.join('\n');

                sendMessage(message)
                    .then(r => console.log('Telegram sending ok'))
                    .catch(err => console.log(err))
            }
            if(error) {
                console.log(error)
            }
        })
    }
}

module.exports = executeCollection;