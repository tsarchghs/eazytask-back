'use strict';

const categorygroups = [
  "Household", "Technical"
]

module.exports = {
  up: (queryInterface, Sequelize) => {

    //Add altering commands here.
    // Return a promise to correctly handle asynchronicity.

    return queryInterface.bulkInsert('categorygroups',
      categorygroups.map(name => ({ 
          name, 
          createdAt: new Date(), 
          updatedAt: new Date()   
        })
      ), {})
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
    return queryInterface.bulkDelete('categorygroups', null, {});
  }
};
