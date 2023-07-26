const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;
const express = require("express");
const { dir } = require("console");
const app = express();

const PORT = process.env.PORT || 3500;

app.use(express.json());

app.use(express.static(path.join(__dirname, "/public")));

app.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.post("^/files-list$", async (req, res) => {
  try {
    console.log("request recieved", req.body);
    let receivedPath = req.body.message;

    // Getting an Array of file in the Directory
    let dirContent = await fsPromises.readdir(path.join(receivedPath));

    // Creating new an array of objects containing items name and
    // if it is a file or dir(directory) from "dirContent".
    let dirContentWithStats = [];
    await (async () => {
      for (let item of dirContent) {
        const stats = await fsPromises.stat(path.join(receivedPath, item));
        let type = stats.isFile() ? "file" : "dir";
        dirContentWithStats.push({ name: item, type });
      }
    })();

    //  Sending the response in JSON Format
    let response = {
      dirContent: dirContentWithStats,
      path: req.body.message,
    };
    res.send(JSON.stringify(response));
  } catch (err) {
    console.log("ERROR", err);
  }
});

app.post("^rename-file$", (req, res) => {
  console.log("request recieved", req.body);

  fs.rename(req.body.oldPath, req.body.newPath, (err) => {
    console.log(err);
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
console.log(`http://localhost:3500`);
