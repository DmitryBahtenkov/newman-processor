const tpApi = require('target.process.api')
const settings = require('settings')

const findOrCreateBug = async (collectionName) => {
    const userStory = settings.read().userStory;
    let bug = tpApi.findBug(userStory, collectionName)
    if (bug) {
        //логика работы с багом
    } else {
        // создаём новый
    }
}