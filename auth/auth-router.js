const router = require("express").Router();
const bcrypt = require("bcryptjs");
const UsersDb = require("../database/UsersModel.js");

router.post("/register", (req, res) => {
  // implement registration

  let user = req.body;
  let hash = bcrypt.hashSync(user.password, 12);

  user.password = hash;

  if (user.password) {
    UsersDb.insert(user)
      .then(saved => {
        res.status(201).json({ success: true, saved });
      })
      .catch(err => res.status(500).json({ success: false, err }));
  } else {
    res
      .status(400)
      .json({ success: false, message: "Password needed to add user" });
  }
});

router.post("/login", (req, res) => {
  // implement login
});

module.exports = router;
