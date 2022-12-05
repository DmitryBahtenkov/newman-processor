const newman = require('newman');

const runNewmanCollection = async (collection, callback) => {
    await newman.run({
        collection: collection,
        reporters: []
    }, callback)
}

module.exports = runNewmanCollection;