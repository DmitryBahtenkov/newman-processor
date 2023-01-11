const fetch = require('node-fetch')

const tpUrl = process.env.TP_URL;
const accessToken = process.env.TP_ACCESS_TOKEN;

const findBug = async (userStory, name) => {
    const accessTokenPart = `access_token=${accessToken}`;
    const parts = [accessTokenPart, `where=(name contains '${name}' and UserStory eq '${userStory}')`]
    const url = `${tpUrl}/api/v1/bugs?${parts.join('&')}`;
    const response = await fetch(url, {
        method: 'GET'
    });
}