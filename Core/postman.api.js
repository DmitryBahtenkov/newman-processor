const baseUrl = 'https://api.getpostman.com/'
const fetch = require('node-fetch')

const getAllCollections = async (apiKey, filter) => {
    const url = baseUrl + 'collections';
    const response = await fetch(url, {
        headers: {'X-API-KEY': apiKey},
        method: 'GET'
    });

    if(response.ok) {
        const json = await response.json();
        if (filter) {
            return json.collections
                .filter(value => filter.some(x => value.name === x || value.id === x))
                .map((value, index) => value.id);
        }
        return json.collections.map((value, index) => value.id);
    } else {
        throw {message: 'postman error', data: await response.json()};
    }
}

const getCollection = async (apiKey, collectionId) => {
    const url = baseUrl + 'collections/' + collectionId;
    const response = await fetch(url, {
        headers: {'X-API-KEY': apiKey},
        method: 'GET'
    });

    if(response.ok) {
        return await response.json();
    } else {
        throw {message: 'postman error', data: response};
    }
}

module.exports = {getCollection, getAllCollections};