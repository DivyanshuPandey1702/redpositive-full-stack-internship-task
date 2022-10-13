import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import emailjs from "emailjs-com";
import AddData from "./AddData";
import UpdateData from "./UpdateData";

function App() {
  const [table, setTable] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "email", headerName: "Email", width: 200 },
    {
      field: "phone",
      headerName: "Phone",
      type: "number",
      width: 130,
    },
    {
      field: "hobbies",
      headerName: "Hobbies",
      width: 400,
    },
    {
      field: "updateBtn",
      headerName: "Update/Delete",
      renderCell: (rowData) => (
        <UpdateData rowData={rowData.row} setTable={setTable} />
      ),
      width: 150,
    },
  ];

  let rows = [];

  const form = useRef();

  function sendEmail(e) {
    e.preventDefault();

    if (selectedRows.length == 0) {
      alert("No data to send.");
      return;
    }

    emailjs
      .sendForm(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        form.current,
        process.env.REACT_APP_EMAILJS_USER_ID
      )
      .then(
        (result) => {
          alert("Data sent to email.");
        },
        (error) => {
          console.log(error.text);
        }
      );
  }

  function fillRows() {
    let i = 0;
    table.map((data) => {
      rows.push({
        id: i + 1,
        _id: data._id,
        name: data.name,
        phone: data.phone,
        email: data.email,
        hobbies: data.hobbies,
        updateBtn: 0,
      });
      i++;
    });
  }

  useEffect(() => {
    axios.get(process.env.REACT_APP_URL).then((res) => {
      setTable(res.data.data.data);
    });
  }, []);

  return (
    <div className="App">
      <h2>
        RedPositive Full Stack Internship Task - Divyanshu Pandey
        (divyanshupandey1702@gmail.com)
      </h2>
      <div style={{ height: 400, width: "100%" }}>
        {table ? fillRows() : null}
        {rows ? (
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            onSelectionModelChange={(ids) => {
              const selectedIDs = new Set(ids);
              const selectedRows = rows.filter((row) =>
                selectedIDs.has(row.id)
              );

              setSelectedRows(selectedRows);
            }}
          />
        ) : null}
      </div>
      <br />
      <AddData setTable={setTable} />
      <form style={{ display: "inline-block" }} ref={form} onSubmit={sendEmail}>
        <textarea
          name="message"
          style={{ display: "none" }}
          readOnly
          value={selectedRows.map((row, c = 1) => {
            return `
                [S.No: ${++c};
                Name: ${row.name}, 
                Email: ${row.email}, 
                Phone: ${row.phone}, 
                Hobbies: ${row.hobbies}
              ]`;
          })}
        />
        <Button
          style={{ display: "inline-block" }}
          variant="contained"
          type="submit"
        >
          Send
        </Button>
      </form>
    </div>
  );
}

export default App;
