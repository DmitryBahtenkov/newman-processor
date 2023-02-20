const fs = require('node:fs');
const path = require('path');
const settingsFile = path.resolve('settings.json');

const set = (userStory, callback) => {
    try {
        fs.rmSync(settingsFile, {force: true});
        fs.writeFile(settingsFile,
            JSON.stringify({userStory: userStory}),
            {flag: 'w+'},
            () => {console.log("File written successfully\n"); callback(true)})
    } catch (e) {
        console.error(e);
        callback(false)
    }
}

const read = () => {
    try {
        const data = fs.readFileSync(settingsFile);
        console.log(data);
        return JSON.parse(data.toString());
    } catch (e) {
        console.error(e);
        return false;
    }
}

module.exports = {set, read};