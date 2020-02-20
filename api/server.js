const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const db = require("../database/dbConfig.js");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);

const authenticate = require("../auth/authenticate-middleware.js");
const authRouter = require("../auth/auth-router.js");
const jokesRouter = require("../jokes/jokes-router.js");

const server = express();

const sessionConfig = {
  secret: process.env.SESSION_SECRET || "dirty little secret",
  name: "cooooookie-chris",
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    secure: process.env.NODE_ENV === "production" ? true : false,
    httpOnly: true
  },
  resave: false,
  saveUninitialized: false,
  store: new KnexSessionStore({
    knex: db,
    tablename: "knexsessions",
    sidfieldname: "sessionid",
    createtable: true,
    clearInterval: 1000 * 60 * 30
  })
};

server.use(session(sessionConfig));

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use("/api/auth", authRouter);
server.use("/api/jokes", authenticate, jokesRouter);

module.exports = server;
