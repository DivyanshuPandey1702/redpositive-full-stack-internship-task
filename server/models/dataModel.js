const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required."],
    trim: true,
    maxlength: [50, "Max Length limit is 100"],
  },
  phone: {
    type: String,
    required: [true, "Phone Number is required."],
    match: [
      /^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$/,
      "Please enter a valid phone number.",
    ],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required."],
    trim: true,
    match: [/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/, "Please enter a valid Email."],
  },
  hobbies: {
    type: String,
    time: true,
    maxlength: [250, "Max Length limit is 250."],
  },
});

const Table = mongoose.model("Table", tableSchema);

module.exports = Table;
