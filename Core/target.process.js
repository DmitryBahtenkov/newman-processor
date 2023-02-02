const tpApi = require('target.process.api')
const settings = require('settings')

const findOrCreateBug = async (collectionName, errorDescription) => {
    const userStory = settings.read().userStory;
    let bug = await tpApi.findBug(userStory, collectionName)
    if (bug) {
        await tpApi.addCommentToBug(bug, `<div>${new Date()}</div>, <div>${errorDescription}</div>`)
        return bug.Id;
    } else {
        const newBug = await tpApi.createBug(collectionName, errorDescription, userStory);
        
        return newBug.Id;
    }
}

export default findOrCreateBug;
