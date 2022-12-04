const newman = require('newman');

const runNewmanCollection = async (collection, callback) => {
    await newman.run({
        collection: collection,
        reporters: ['json']
    }, callback)
}

module.exports = runNewmanCollection;