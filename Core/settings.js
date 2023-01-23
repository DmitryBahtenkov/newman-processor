import * as fs from "node:fs";

const settingsFile = 'settings.json';

const set = (userStory) => {
    try {
        fs.writeFileSync(settingsFile, JSON.stringify({userStory: userStory}));
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

const read = async () => {
    try {
        return fs.readFileSync(settingsFile);
    } catch (e) {
        console.error(e);
        return false;
    }
}

export default {set, read};