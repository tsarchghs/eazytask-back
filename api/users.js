const validateRequest = require("../middlewares/validateRequest");
const post_users = require("./validations/users/post")
const bcrypt = require("bcrypt")
const router = require("express").Router();

const saltRounds = 10;


module.exports = ({ database}) => {
  console.log(1111,database)
  let { User } = require("../models")[database]

  router.post('/', validateRequest(post_users), async (req, res) => {
    console.log({ User }, 9991)
    console.log({body:req.body})
    bcrypt.hash(req.body.password, saltRounds, async (err, hashedPassword) => {
      if (err) throw err
      if (!req.body.notification_option) req.body.notification_option = "EMAIL"
      let user;
      
      try {
        user = await User.create({ ...req.body, password: hashedPassword, isAdmin: false })
      } catch (err) {
          console.log(123,err)
          return res.send({
            code: 409,
            message: "Cannot create resource because it conflicts with the current state of the server.",
            errors: err.errors.map(err => {
              if (err.message.indexOf("email") !== -1 &&
                err.message.indexOf("unique") !== -1) return "users.email must be unique"
              else return err.message
            })  
          })
      }
      
      return res.send({
        message: "success",
        code: 201,
        data: user
      })
    });
  })

  return router;
}