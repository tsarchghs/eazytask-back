'use strict';

// const request = require("request");

const users = require("./data/users");
const bcrypt = require("bcrypt")
const { SALT_ROUNDS } = require("../configs")



module.exports = {
    up: async (queryInterface, Sequelize) => {
        
    //Add altering commands here.
    // Return a promise to correctly handle asynchronicity.
    let hashedPassword = await bcrypt.hash("mockpassword", SALT_ROUNDS);
    return queryInterface.bulkInsert('users', 
          users.map(user => ({ ...user, password: hashedPassword, createdAt: new Date(), updatedAt: new Date() }))
      , {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
     return queryInterface.bulkDelete('users', null, {});
  }
};
