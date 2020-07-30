"use strict";

const http = require("http");
const chalk = require("chalk");
const express = require("express");
const debug = require("debug")("platziverse:api");
const api = require("./api.js");
const port = process.env.PORT || 3000;
const app = express();

const server = http.createServer(app); //se pasa la app de express como request handler

app.use("/api", api);
// Express Error Handler
app.use((err, req, res, next) => {
  debug(`Error: ${err.message}`);

  if (err.message.match(/not found/)) {
    return res.status(404).send({ error: err.message });
  }

  res.status(500).send({ error: err.message });
});

function handleFatalError(err) {
  console.error(`${chalk.red("[fatal error]")} ${err.message}`);
  console.error(err.stack);
  process.exit(1);
}

process.on("uncaughtException", handleFatalError);
process.on("unhandledRejection", handleFatalError);
//Si esto ejecutando server.js directamente se inicia el servidor
if (!module.parent) {
  process.on("uncaughtException", handleFatalError);
  process.on("unhandledRejection", handleFatalError);

  server.listen(port, () => {
    console.log(
      `${chalk.green("[platziverse-api]")} server listening on port ${port}`
    );
  });
}
//Si lo estoy requiriendo en algun otro lado, exporto el server y que se inicie alla
module.exports = server;
