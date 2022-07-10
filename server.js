const fs = require("fs");

/* Load the env file */
if (fs.existsSync(".env")) {
  require("dotenv").config();
}

const express = require("express");
const http = require('http');
const https = require('https');
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const path = require("path");
const cluster = require('cluster');

const dbConnect = require("./server/dbConnect");
const { config: { httpOptions, httpsOptions }, logger } = require("./server/config");

/* Run HTTP server for "development" */
const startHttp = app => {
  const httpServer = http.createServer(app);

  httpServer.listen(httpOptions, () => {
    logger.info(`Process: ${process.pid} | http://${httpOptions.host} server is running at port ${httpOptions.port}`);
  });
};

/* Run HTTPS server for "Production" */
const startHttps = app => {
  const { keyPath, certPath, serverOptions } = httpsOptions;

  const credentials = {
    key: fs.readFileSync(keyPath, "utf8"),
    cert: fs.readFileSync(certPath, "utf8"),
  };
  const httpsServer = https.createServer(credentials, app);

  httpsServer.listen(serverOptions, () => {
    logger.info(`Process: ${process.pid} | https://${serverOptions.host} server is running at port ${serverOptions.port}`);
  });
};

const startServer = async () => {
  try {
    const app = express();

    await dbConnect();

    app.use(helmet());
    app.use(cors());
    app.use(bodyParser.urlencoded({extended: true, limit: '10mb'}));
    app.use(bodyParser.json({limit: '10mb'}));

    app.use('/public', express.static('public')); /* Public folder */

    const routes = require('./server/routes');
    routes(app);

    if (process.env.NODE_ENV === "production") {
      app.use("/", express.static("client/build"));
      app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client/build/index.html"));
      });
      /* Run HTTPS server */
      startHttps(app);
    } else {
      /* Run HTTP server */
      startHttp(app);
    }

    app.get("/", (req, res) => res.send("OK"));

  } catch (err) {
    console.log("ERRROR :::: ", err);
    logger.error(err);
  }
};

/* Run in the Cluster mode */
const initCluster = async () => {
  if (cluster.isMaster) {
    const numWorkers = require('os').cpus().length;
   
    logger.info(`Master cluster setting up ${numWorkers} workers`);
    for (var i = 0; i < numWorkers; i++) {
     cluster.fork();
    }
   
    cluster.on('online', worker => {
      logger.info(`Worker ${worker.process.pid} is online`);
    });
   
    cluster.on('exit', (worker, code, signal) => {
      logger.info(`Worker ${worker.process.pid} died with code: ${code} and signal: ${signal}`);
      logger.info('Starting a new worker');
      cluster.fork();
    });

  } else {
    await startServer();
  }
};

initCluster();
