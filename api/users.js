const { User } = require("../models");
const validateRequest = require("../middlewares/validateRequest");
const post_users = require("./validations/users/post")
const bcrypt = require("bcrypt")
const router = require("express").Router();

const saltRounds = 10;

router.post('/', validateRequest(post_users), async (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, async (err, hashedPassword) => {
    if (err) throw err
    if (!req.body.notification_option) req.body.notification_option = "EMAIL"
    let user;
    
    try {
      user = await User.create({ ...req.body, password: hashedPassword, isAdmin: false })
    } catch (err) {
        return res.send({
          code: 409,
          message: "Cannot create resource because it conflicts with the current state of the server.",
          errors: err.errors.map(err => err.message)  
        })
    }
    
    return res.send({
      message: "success",
      code: 201,
      data: user
    })
  });
})

module.exports = router;