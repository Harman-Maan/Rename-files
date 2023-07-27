const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;
const express = require("express");
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

    // Creating new an array of objects containing items name, and
    // if it is a file or dir(directory) from "dirContent", along with file extension.
    let dirContentWithStats = [];
    await (async () => {
      for (let item of dirContent) {
        const stats = await fsPromises.stat(path.join(receivedPath, item));
        let type = stats.isFile() ? "file" : "dir";

        let fileInfo = {
          name: item,
          type,
        };
        if (stats.isFile()) fileInfo.fileExtension = path.extname(path.join(receivedPath, item));
        dirContentWithStats.push(fileInfo);
      }
    })();

    //  Sending the response in JSON Format
    let response = {
      dirContent: dirContentWithStats,
      path: req.body.message,
      id: "files_list",
    };
    res.send(JSON.stringify(response));
  } catch (err) {
    console.log("ERROR", err);
  }
});

app.post("^/rename-file$", async (req, res) => {
  console.log("request recieved", req.body);

  const oldPath = path.join(req.body.oldPath);
  const directoryPath = path.dirname(oldPath);

  const newPath = path.join(directoryPath, req.body.newName);

  await fsPromises.rename(oldPath, newPath, (err) => {
    console.log(err);
  });

  let response = {
    id: "rename_file",
    fileName: path.basename(newPath),
    message: "File Successfully renamed",
  };

  res.send(JSON.stringify(response));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
console.log(`http://localhost:3500`);
