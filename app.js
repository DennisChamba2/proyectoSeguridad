require("dotenv").config()

const claseServer = require('./models/server')

const server = new claseServer();

server.listen()

