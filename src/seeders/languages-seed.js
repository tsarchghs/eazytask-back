'use strict';

const languages = [
  "English", "Deutch", "Shqip"
]

module.exports = {
  up: (queryInterface, Sequelize) => {

    //Add altering commands here.
    // Return a promise to correctly handle asynchronicity.

    return queryInterface.bulkInsert('languages',
      languages.map(name => ({ name, createdAt: new Date(), updatedAt: new Date()  }))
      , {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
    return queryInterface.bulkDelete('languages', null, {});
  }
};
