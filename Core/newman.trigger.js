const newman = require('../Core/newman.api')
const postmanApi = require('../Core/postman.api')
const sendMessage = require('../Core/telegram.api')
const findOrCreateBug = require('../Core/target.process')

const MESSAGE_LENGTH = 4096;
const tpUrl = process.env.TP_URL;

const executeCollection = async (postmanKey, data) => {
    const collections = await postmanApi.getAllCollections(postmanKey, data.collections);
    console.log(collections);
    for (const collectionId of collections) {
        await newman(`https://api.getpostman.com/collections/${collectionId}?apikey=${postmanKey}`,async (error, summary) => {
            if(summary) {
                const name = summary.collection.name;
                const totalTests = summary.run.stats.assertions.total;
                const failTests = summary.run.stats.assertions.failed;
                const fails = summary.run.failures.map(x => `${x.source.name}: ${x.error.message}`);
                const failsStr = failTests ? fails.map(x => `- ${x}`).join('\n') : 0;

                const emojies = failTests
                    ? '❌❌❌'
                    : '✅✅✅';

                let message = `${emojies}\nКоллекция: ${name}\n`
                    + `Всего проверок: ${totalTests}\n`
                    + `Тестов с ошибкой: ${failTests}\n`;

                let parameters = '';

                let bugId;
                try {
                    bugId = failsStr ? await findOrCreateBug(name, failsStr) : 0;
                }catch (e) {
                    console.error(e)
                }

                if(failTests) {
                    message += `***\n${failsStr}`
                }

                if(data.params) {
                    parameters += '\n***'
                    for (const key of Object.keys(data.params)) {
                        parameters += `\n${key}: ${data.params[key]}`
                    }
                }

                if(bugId) {
                    const url = `${tpUrl}/entity/${bugId}`;
                    parameters += `\n${url}`;
                }

                if(message.length + parameters.length >= MESSAGE_LENGTH) {
                    message = message.substring(0, MESSAGE_LENGTH - parameters.length) + parameters;
                } else {
                    message += parameters;
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
