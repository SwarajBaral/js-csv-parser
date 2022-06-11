const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.use(bodyParser.urlencoded({ extended: false }));

app.post("/api/csv-to-json", (req, res) => {
  try {
    const csv = req.body.csv.trim();
    const json = [];
    const lines = csv.split(/\r?\n/);
    const fields = lines[0].split(",");

    lines.shift();

    const convertToJson = (values) => {
      let temp = {};
      let j = 0;
      for (var i of values.split(",")) {
        temp[String(fields[j])] = i === "" ? null : i;
        j++;
      }
      json.push(temp);
    };

    for (var j of lines) {
      convertToJson(j);
    }

    res.status(200).json({
      body: json,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/api/json-to-csv", (req, res) => {
  try {
    var json;
    try {
      json = JSON.parse(req.body.json);
    } catch (error) {
      throw new Error("Invalid CSV data");
    }

    const fields = [];

    var csv = "";

    for (var i in json[0]) {
      fields.push(i);
    }

    for (var index in fields) {
      csv += fields[index];
      if (parseInt(index) === fields.length - 1) {
        csv += "\n";
      } else {
        csv += ",";
      }
    }

    for (var object of json) {
      for (var index in fields) {
        csv += object[fields[index]] ? object[fields[index]] : "";
        if (parseInt(index) === fields.length - 1) {
          csv += "\n";
        } else {
          csv += ",";
        }
      }
    }

    res.status(200).json({
      body: csv,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen("8000", (err) => {
  if (err) {
    console.error(err);
  }
  console.log("Server listening on http://localhost:8000");
});
