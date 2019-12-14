const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secrets = require("../config/secrets.js");
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

  let { username, password } = req.body;

  UsersDb.findBy({ username })
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);

        res
          .status(200)
          .json({ success: true, message: `Welcome ${username}!`, token });
      } else {
        res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
      }
    })
    .catch(err => res.status(500).json({ success: false, err }));
});

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username
  };

  const options = {
    expiresIn: "1d"
  };

  return jwt.sign(payload, secrets.jwtSecret, options);
}

module.exports = router;
