'use strict';

const categories = [
  {
    name: "Handicraft work",
    categoryGroupId: 1
  },
  {
    name: "Gradening work",
    categoryGroupId: 1
  },
  {
    name: "Moving & Cleaning",
    categoryGroupId: 1
  },
  {
    name: "Furniture",
    categoryGroupId: 1
  },
  {
    name: "Handicraft work",
    categoryGroupId: 1
  },
  {
    name: "CategoryName",
    categoryGroupId: 2
  }
]

module.exports = {
  up: (queryInterface, Sequelize) => {

    //Add altering commands here.
    // Return a promise to correctly handle asynchronicity.

    return queryInterface.bulkInsert('categories',
      categories.map(category => ({
        ...category,
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
    return queryInterface.bulkDelete('categories', null, {});
  }
};
