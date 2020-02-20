const db = require("./dbConfig.js");

module.exports = {
  insert,
  findBy
};

function insert(newUser) {
  return db("users")
    .insert(newUser)
    .then(ids => {
      return getById(Ids[0]);
    });
}

function findBy(filter) {
  return db("users")
    .select("id", "username", "password")
    .where(filter)
    .first();
}
