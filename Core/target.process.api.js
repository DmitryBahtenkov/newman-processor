const fetch = require('node-fetch')

const tpUrl = process.env.TP_URL;
const accessToken = process.env.TP_ACCESS_TOKEN;
const format = 'format=json'

const findBug = async (userStory, name) => {
    const accessTokenPart = `access_token=${accessToken}`;
    const parts = [accessTokenPart, `where=(name contains '${name}')`, format]
    const url = `${tpUrl}/api/v1/UserStories/${userStory}/bugs?${parts.join('&')}`;
    const response = await fetch(url, {
        method: 'GET'
    });
    
    const json = await response.json()
    if (json.Items) {
        return json.Items[0]
    }
    
    return null;
}

export default {findBug};

