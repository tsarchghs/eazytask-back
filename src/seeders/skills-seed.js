'use strict';

const skills = [
  "Moving", "Cleaning"
]

module.exports = {
  up: (queryInterface, Sequelize) => {

    //Add altering commands here.
    // Return a promise to correctly handle asynchronicity.
    console.log({queryInterface})
    return queryInterface.bulkInsert('skills', 
          skills.map(name => ({ name, createdAt: new Date(), updatedAt: new Date() }))
      , {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
     return queryInterface.bulkDelete('skills', null, {});
  }
};
