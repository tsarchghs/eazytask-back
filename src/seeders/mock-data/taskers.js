const randomNumber = require("../utils/randomNumber");
const skills = require("../data/skills")
const languages = require("../data/languages")
const cities = require("../data/cities")

const getRandomIds = array => {
    let ids = []
    let max = array.length //array.length - 1 > 5 ? 5 : array.length - 1
    for (let x = 1; x < randomNumber(1, max);x++){
        let id = randomNumber(1, max)
        if (ids.indexOf(id) === -1) ids.push(id)
    }
    return ids;
}

module.exports = () => {
    let taskers = {
        byIds: [],
        allIds: []
    }
    for (let x=1;x<201;x++){
        let skills_ids = getRandomIds(skills); 
        let languages_ids = getRandomIds(languages)
        let cities_ids = getRandomIds(cities);
        let tasker = { UserId: x, skills_ids, languages_ids, cities_ids };
        taskers.byIds[x] = tasker;
        taskers.allIds.push(x)
    }
    return taskers
}