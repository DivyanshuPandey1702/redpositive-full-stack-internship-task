const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const express = require("express");
const body_parser = require("body-parser");
const cors = require("cors");

// for security and compression
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const compression = require("compression");

const Table = require("./models/dataModel");

const app = express();
app.use(
  body_parser.urlencoded({
    extended: true,
  })
);
app.use(body_parser.json());
// set security http headers
app.use(helmet());
// data sanatization against nosql query injection
app.use(mongoSanitize());
// data sanatizaton against xss attacks
app.use(xss());
app.use(compression());

// CORS
app.use(cors());

// CRUD

app.get("/", async (req, res) => {
  try {
    let data = await Table.find();
    data.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
    res.status(200).json({
      status: "success",
      lengths: data.length,
      data: {
        data,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "failure",
    });
    console.log(err);
  }
});

app.post("/", async (req, res) => {
  try {
    let newData = new Table({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      hobbies: req.body.hobbies,
    });
    await newData.save();
    res.status(200).json({
      status: "success",
    });
    console.log("New Entry Added.");
  } catch (err) {
    res.status(404).json({
      status: "failure",
    });
    console.log(err);
  }
});

app.put("/", async (req, res, next) => {
  try {
    await Table.findByIdAndUpdate(req.body.id, {
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      hobbies: req.body.hobbies,
    });
    res.status(200).json({
      status: "success",
    });
    console.log(`Entry update with id: ${req.body.id}`);
  } catch (err) {
    res.status(404).json({
      status: "failure",
    });
    console.log(err);
  }
  next();
});

app.delete("/", async (req, res, next) => {
  try {
    await Table.findByIdAndRemove(req.body.id);
    res.status(200).json({
      status: "success",
    });
    console.log(`Entry deleted with id: ${req.body.id}`);
  } catch (err) {
    res.status(404).json({
      status: "failure",
    });
    console.log(err);
  }
  next();
});

module.exports = app;
