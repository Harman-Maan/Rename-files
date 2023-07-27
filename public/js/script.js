import icons from "./icons.js";

const mainPath = "C:/Users/Harman Maan";
const mainFoldersArr = [
  { name: "Desktop", type: "dir" },
  { name: "Downloads", type: "dir" },
  { name: "Documents", type: "dir" },
  { name: "Music", type: "dir" },
  { name: "Videos", type: "dir" },
  { name: "Pictures", type: "dir" },
];

const main = document.getElementById("main");
const previousDirBtn = document.getElementById("previous-dir");
const displayCurrentPath = document.getElementById("current-path");
const processingIcon = document.getElementById("processing");

previousDirBtn.addEventListener("click", previousDir);

let currentPath = mainPath;
displayCurrentPath.innerHTML = currentPath;

const xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    let response = JSON.parse(xhttp.responseText);
    switch (response.id) {
      case "files_list":
        currentPath = response.path;
        displayCurrentPath.innerHTML = currentPath;
        displayFiles(response.dirContent);
        previousDirBtnState();
        break;
      case "rename_file":
        console.log(response.message);
        processingIcon.style.display = "none";
        break;
    }
  }
};

function getFilesList(dir) {
  let url = "http://localhost:3500/files-list";

  let path = {
    message: dir,
  };

  xhttp.open("POST", url, true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(JSON.stringify(path));
}

function displayFiles(files) {
  let filterdArr = files.filter((file) => {
    if (!/\.ini$/.test(file.name)) return true;
  });
  if (filterdArr.length == 0) {
    main.innerHTML = "<p id='folder-empty'>Folder Empty</p>";
    return;
  }
  let fileContent = [];

  let mappedArr = filterdArr.map((file) => {
    let [icon, name] = getFileIcon(file);
    let extension = file.hasOwnProperty("fileExtension") ? file.fileExtension.match(/\w+$/) : "";

    fileContent.push({
      path: `${currentPath}/${file.name}`,
      icon,
      extension,
      name,
      type: file.type,
    });

    return `<div class="${file.type} item">
            <i class="${icon}"></i>
            <i class="fa-solid fa-pencil edit-name"></i>
            <p class="file-name">${file.name}</p>
          </div>`;
  });
  main.innerHTML = mappedArr.join(" ");

  // Adding "click" even listeners
  let allItems = document.querySelectorAll(".item");
  let editNameElements = document.querySelectorAll(".edit-name");

  for (let i = 0; i < fileContent.length; i++) {
    let pathToFile = fileContent[i].path;

    if (allItems[i].classList.contains("dir")) {
      allItems[i].addEventListener("dblclick", () => {
        getFilesList(pathToFile);
      });
    }

    editNameElements[i].addEventListener("click", (event) => {
      event.stopPropagation();
      rename(allItems[i], fileContent[i], pathToFile);
    });
  }
}

function getFileIcon({ name, type, fileExtension }) {
  if (type == "dir") {
    return [icons.folder, name, ""];
  } else {
    let fileNameRegEx = new RegExp(`^.*(?=${fileExtension}$)`);
    let fileName = name.match(fileNameRegEx)[0];
    for (let icon in icons) {
      if (`.${icon}` == fileExtension) {
        return [icons[icon], fileName, fileExtension];
      }
    }
    return [icons.file, name];
  }
}

function rename(clickedItem, fileContent, oldPath) {
  let oldHtml = clickedItem.innerHTML;
  let isFile = fileContent.type == "file" ? true : false;

  clickedItem.classList.replace("item", "edit-item-name");

  clickedItem.innerHTML = `
  <i class="${fileContent.icon}"></i>
      <input type="text" id="item-name-input" value="${fileContent.name}" placeholder="New name" required>
      ${isFile ? `.<input type="text" id="file-extension-input" value="${fileContent.extension}" required>` : ""}
      <i class="fa-solid fa-check" id="change-name"></i>
  `;

  //Autoselect the input field value  when user clicks in it.
  const itemNameInput = document.getElementById("item-name-input");
  const fileExtensionInput = document.getElementById("file-extension-input");

  function autoSelect() {
    this.select();
  }
  itemNameInput.addEventListener("click", autoSelect);
  if (isFile) fileExtensionInput.addEventListener("click", autoSelect);

  let changeName = document.getElementById("change-name");
  changeName.addEventListener("click", (event) => {
    event.stopPropagation();
    console.log("ran");

    // If no change is made, it will just revert back to old html and stop any other function from running.
    let anyChange = itemNameInput.value != fileContent.name || (isFile && fileExtensionInput.value != fileContent.extension) ? true : false;
    if (!anyChange) {
      document.addEventListener("click", (event) => handleOutsideClick(event, clickedItem, oldHtml));
      clickedItem.classList.replace("item", "edit-item-name");
      clickedItem.innerHTML = oldHtml;
      return;
    }

    let newName;
    if (isFile) {
      newName = `${itemNameInput.value}.${fileExtensionInput.value}`;
    } else {
      newName = itemNameInput.value;
    }
    sendRenameRequest(oldPath, newName);
    processingIcon.style.display = "block";
    clickedItem.innerHTML = updateItem(fileContent, newName);
  });

  // If user clicks somewhere else on screen
  document.addEventListener("click", (event) => handleOutsideClick(event, clickedItem, oldHtml));
}

function handleOutsideClick(event, clickedItem, oldHtml) {
  if (!clickedItem.contains(event.target)) {
    clickedItem.classList.replace("edit-item-name", "item");
    clickedItem.innerHTML = oldHtml;
    document.removeEventListener("click", handleOutsideClick);
  }
}

function updateItem(fileContent, newName) {
  // This would prevent "handleOutsideClick Form running"
  document.removeEventListener("click", handleOutsideClick);

  return `<div class="${fileContent.type} item">
            <i class="${fileContent.icon}"></i>
            <i class="fa-solid fa-pencil edit-name"></i>
            <p class="file-name">${newName}</p>
          </div>`;
}

function sendRenameRequest(oldPath, newName) {
  let url = "http://localhost:3500/rename-file";

  let message = {
    oldPath,
    newName,
  };

  xhttp.open("POST", url, true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(JSON.stringify(message));
}

function previousDir() {
  if (previousDirBtn.disabled) return;

  let previousDirPath = currentPath.match(/.+(?=\/)/)[0];

  if (previousDirPath == mainPath) {
    currentPath = mainPath;
    displayCurrentPath.innerHTML = currentPath;
    previousDirBtnState();
    displayFiles(mainFoldersArr);
  } else {
    getFilesList(previousDirPath);
  }
}

function previousDirBtnState() {
  if (currentPath == mainPath) {
    previousDirBtn.style.color = "#222";
    previousDirBtn.style.backgroundColor = "#aaa";
    previousDirBtn.style.cursor = "not-allowed";
    previousDirBtn.disabled = true;
  } else {
    previousDirBtn.style.color = "#000";
    previousDirBtn.style.backgroundColor = "#fff";
    previousDirBtn.style.cursor = "pointer";
    previousDirBtn.disabled = false;
  }
}

displayFiles(mainFoldersArr);
previousDirBtnState();
