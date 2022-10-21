const express = require("express");
const connectDB = require("./database/db");
require("dotenv/config");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require('path');
const morgan = require('morgan');
const compression = require('compression');
const helmet = require("helmet")

const authRoutes = require("./routes/authRoutes");
const memberRoutes = require("./routes/memberActions")

const app = express();

app.use(cors({ origin: "https://kingspalace-f9dd4.web.app", allowedHeaders: "Content-Type, Authorization", methods: "POST, GET, PUT, PATCH, DELETE" }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json({limit: '50mb'}));
app.use(helmet())
app.use(morgan())
app.use(compression())

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, PATCH, DELETE");
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   next()
// });


app.use("/auth", authRoutes)
app.use("/members", memberRoutes)

app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json(error.message);
})

const port = process.env.PORT || 5000;

connectDB(() => {
  app.listen(port, () =>
    console.log(`Connected Successfully to port ${port}...`)
  );
});