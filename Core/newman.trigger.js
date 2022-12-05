const newman = require('../Core/newman.api')
const postmanApi = require('../Core/postman.api')
const sendMessage = require('../Core/telegram.api')

const executeCollection = async (postmanKey, data) => {
    const collections = await postmanApi.getAllCollections(postmanKey, data.collections);
    for (const collectionId of collections) {
        await newman(`https://api.getpostman.com/collections/${collectionId}?apikey=${postmanKey}`, (error, summary) => {
            if(summary) {
                const name = summary.collection.name;
                const totalTests = summary.run.stats.assertions.total;
                const failTests = summary.run.stats.assertions.failed;
                const fails = summary.run.failures.map(x => `${x.source.name}: ${x.error.message}`);

                const emojies = failTests
                    ? '❌❌❌'
                    : '✅✅✅';

                let message = `${emojies}\nКоллекция: ${name}\n`
                    + `Всего проверок: ${totalTests}\n`
                    + `Тестов с ошибкой: ${failTests}\n`;

                if(failTests) {
                    message += `***\n${fails.join('\n')}`
                }

                if(data.params) {
                    message += '\n***'
                    for (const key of Object.keys(data.params)) {
                        message += `\n${key}: ${data.params[key]}`
                    }
                }


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