const newman = require('../Core/newman.api')
const postmanApi = require('../Core/postman.api')
const sendMessage = require('../Core/telegram.api')
const findOrCreateBug = require('../Core/target.process')

const MESSAGE_LENGTH = 4096;
const tpUrl = process.env.TP_URL;

const groupBy = (array, key) => {
    return array.reduce((result, currentValue) => {
        // get the nested propert value
        const objKey = nestedObjectByString(currentValue, key);
        result[objKey] = (result[objKey] || []).concat(
            currentValue)
        return result;
    }, {});
};

// return value of nested property of an object
const nestedObjectByString = (obj, key) => {
    key = key.replace(/\[(\w+)\]/g, '.$1');  // convert indexes to properties
    key = key.replace(/^\./, ''); // strip a leading dot
    const a = key.split('.');
    for (let i = 0, n = a.length; i < n; ++i) {
        const k = a[i];
        if (k in obj) {
            obj = obj[k];
        } else {
            return;
        }
    }
    return obj;
}

const executeCollection = async (postmanKey, data) => {
    const collections = await postmanApi.getAllCollections(postmanKey, data.collections);
    console.log(collections);
    for (const collectionId of collections) {
        await newman(`https://api.getpostman.com/collections/${collectionId}?apikey=${postmanKey}`,async (error, summary) => {
            if(summary) {
                const name = summary.collection.name;
                const totalTests = summary.run.stats.assertions.total;
                const failTests = summary.run.stats.assertions.failed;

                const groupByRequest = groupBy(summary.run.failures, "source.name");

                const fails = [];
                for (const key in groupByRequest) {
                    fails.push(`${key}:`);
                    const errors = groupByRequest[key].map(x => `- ${x.error.test}: ${x.error.message}`);
                    fails.push(errors.join('\n'))
                    fails.push('___')
                }

                const failsStr = failTests ? fails.join('\n') : 0;

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
                    parameters += `\nСоздан баг - ${url}`;
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
