const fetch = require('node-fetch')

const tpUrl = process.env.TP_URL;
const accessToken = process.env.TP_ACCESS_TOKEN;
const format = 'format=json'

const tag = 'OpenAPI:computer:'
const teamId = '4'
const projectId = '220753'

const findBug = async (userStory, name) => {
    const accessTokenPart = `access_token=${accessToken}`;
    const parts = [accessTokenPart, `where=(name contains '${name}')`, format]
    const url = `${tpUrl}/api/v1/UserStories/${userStory}/bugs?${parts.join('&')}`;
    const response = await fetch(url, {
        method: 'GET'
    });
    
    const json = await response.json()
    if (json.Items) {
        console.log(`find bug by collection ${name}`)
        return json.Items[0]
    }
    
    return null;
}

const createBug = async (name, description, userStory) => {
  const data = {
      Name: name,
      Description: description,
      Tags: tag,
      UserStory: {Id: userStory},
      Team: {Id: teamId},
      Project: {Id: projectId}
  };

  const url = `${tpUrl}/api/v1/Bugs?access_token=${accessToken}&resultFormat=json`;
  const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {'Content-Type': 'application/json'}
  });
  
  if(response.status === 201) {
      return await response.json();
  } else {
      throw {message: await response.text()};
  }
}

const addCommentToBug = async (id, comment) => {
    console.log('try add comment')
    const data = {
        General: {
            Id: id
        },
        Description: comment
    };

    const url = `${tpUrl}/api/v1/Comments?access_token=${accessToken}&resultFormat=json`;
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
    });

    if(response.status === 201) {
        return await response.json();
    } else {
        throw {message: await response.text()};
    }
}

module.exports = {findBug, createBug, addCommentToBug};

