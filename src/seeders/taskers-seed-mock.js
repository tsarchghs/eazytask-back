'use strict';

const getTaskersMockData = require("./mock-data/taskers");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        let taskers = getTaskersMockData()
        await queryInterface.bulkInsert('taskers',
            taskers.allIds.map(id => ({ 
                UserId: id,
                createdAt: new Date(), 
                updatedAt: new Date() 
            }))
            , {});
        let promises = []
        for (let x=1;x<taskers.allIds.length-1;x++){
            let tasker = taskers.byIds[x];
            let tasker_cities = tasker.cities_ids.map(city_id => ({ TaskerId: x, CityId: city_id, createdAt: new Date(), updatedAt: new Date() }))
            let tasker_skills = tasker.skills_ids.map(skill_id => ({ TaskerId: x, SkillId: skill_id, createdAt: new Date(), updatedAt: new Date() }))
            let tasker_languages = tasker.languages_ids.map(language_id => ({ TaskerId: x, LanguageId: language_id, createdAt: new Date(), updatedAt: new Date() }))
            if (tasker_cities.length) promises.push(queryInterface.bulkInsert('tasker_cities',tasker_cities, {}));
            if (tasker_skills.length) promises.push(queryInterface.bulkInsert('tasker_skills',tasker_skills, {}));
            if (tasker_languages.length) promises.push(queryInterface.bulkInsert('tasker_languages',tasker_languages, {}));
        }
        //Add altering commands here.
        // Return a promise to correctly handle asynchronicity.
        return Promise.all(promises)
    },

    down: (queryInterface, Sequelize) => {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.
    
          Example:
          */
        return queryInterface.bulkDelete('taskers', null, {});
    }
};
