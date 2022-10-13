import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import axios from "axios";

// const api = axios.create({
//   baseURL: process.env.REACT_APP_URL,
//   headers: {
//     "Access-Control-Allow-Origin": "*",
//     "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
//     "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
//     "Content-Type": "application/json",
//   },
// });

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 436,
  bgcolor: "background.paper",
  borderRadius: "1rem",
  boxShadow: 24,
  p: 4,
};

export default function UpdateData({ rowData, setTable }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const id = rowData.id;
  const [name, setName] = useState(rowData.name);
  const [email, setEmail] = useState(rowData.email);
  const [phone, setPhone] = useState(rowData.phone);
  const [hobbies, setHobbies] = useState(rowData.hobbies);

  const deleteData = async () => {
    await axios.delete(process.env.REACT_APP_URL, {
      headers: {},
      data: {
        id: rowData._id,
      },
    });
    alert("Data deleted.");
    setName("");
    setEmail("");
    setPhone("");
    setHobbies("");
    axios.get(process.env.REACT_APP_URL).then((res) => {
      setTable(res.data.data.data);
    });
    setOpen(false);
  };

  const updateData = async () => {
    const regPhone = new RegExp(
      "[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}"
    );
    const regEmail = new RegExp("[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+");
    const regString = new RegExp("[a-zA-Z ]*");

    if (!regString.test(name) || name.length == 0) {
      alert("Name not valid.");
      return;
    }
    if (!regEmail.test(email) || email.length == 0) {
      alert("Email not valid.");
      return;
    }
    if (!regPhone.test(phone) || phone.length == 0) {
      alert("Phone not valid.");
      return;
    }
    if (!regString.test(hobbies) || hobbies.length == 0) {
      alert("Hobbies not valid.");
      return;
    }
    const data = {
      id: rowData._id,
      name: name,
      email: email,
      phone: phone,
      hobbies: hobbies,
    };
    await axios.put(process.env.REACT_APP_URL, data);
    alert("Data updated.");
    axios.get(process.env.REACT_APP_URL).then((res) => {
      setTable(res.data.data.data);
    });
    setOpen(false);
  };

  return (
    <div style={{ display: "inline" }}>
      <Button
        style={{ marginRight: "1rem", display: "inline" }}
        variant="contained"
        onClick={handleOpen}
      >
        Edit Data
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <TextField
            style={{
              marginBottom: "1rem",
              marginRight: "1rem",
              display: "inline-block",
            }}
            id="name"
            label="Name"
            variant="outlined"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <TextField
            style={{ marginBottom: "1rem", display: "inline-block" }}
            id="email"
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <TextField
            style={{ marginBottom: "1rem", marginRight: "1rem" }}
            id="phone"
            label="Phone"
            variant="outlined"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
            }}
          />
          <TextField
            id="hobbies"
            label="Hobbies"
            multiline
            rows={3}
            variant="outlined"
            value={hobbies}
            onChange={(e) => {
              setHobbies(e.target.value);
            }}
          />
          <Button
            style={{ marginRight: "1rem" }}
            variant="contained"
            onClick={updateData}
          >
            Update
          </Button>
          <Button variant="contained" color="error" onClick={deleteData}>
            Delete
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
