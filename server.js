const fs = require("fs");

/* Load the env file */
if (fs.existsSync(".env")) {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const path = require("path");
const dbConnect = require("./server/dbConnect");
const { logger } = require("./server/config");

const port = process.env.PORT || 5000;

/* Handle server creation */
const app = express();

const startServer = async () => {
  try {
    await dbConnect();

    app.use(helmet());
    app.use(cors());
    app.use(bodyParser.urlencoded({extended: true, limit: '10mb'}));
    app.use(bodyParser.json({limit: '10mb'}));

    app.use('/public', express.static('public')); // Public folder

    const routes = require('./server/routes');
    routes(app);

    if (process.env.NODE_ENV === "production") {
      app.use("/", express.static("client/build"));
      app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client/build/index.html"));
      });
    }

    app.get("/", (req, res) => res.send("Hello from Learn Nepal!!"));
    app.listen(port, () => logger.info(`Node JS Server Running at port ${port}`));

  } catch (err) {
    console.log("ERRROR :::: ", err);
    logger.error(err);
  }
};

startServer();
