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

previousDirBtn.addEventListener("click", previousDir);

let currentPath = mainPath;
displayCurrentPath.innerHTML = currentPath;

const xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    let response = JSON.parse(xhttp.responseText);
    currentPath = response.path;
    displayCurrentPath.innerHTML = currentPath;
    displayFiles(response.dirContent);
    previousDirBtnState();
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
    let [icon, name, extension] = getFileIcon(file);

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

function getFileIcon({ name, type }) {
  if (type == "dir") {
    return [icons.folder, name, ""];
  } else {
    let fileName = name.match(/^.*((?=\.\w+))/)[0];
    let extension = name.match(/\w+$/)[0];
    for (let icon in icons) {
      if (icon == extension) {
        return [icons[icon], fileName, extension];
      }
    }
    return [icons.file, name, extension];
  }
}

function rename(clickedItem, fileContent, oldPath) {
  let oldHtml = clickedItem.innerHTML;

  clickedItem.classList.replace("item", "edit-item-name");
  clickedItem.innerHTML = `
  <i class="${fileContent.icon}"></i>
      <input type="text" id="item-name-input" value="${fileContent.name}" placeholder="New name" required>
      ${fileContent.extension ? `.<input type="text" id="file-extension-input" value="${fileContent.extension}" required>` : ""}
      <i class="fa-solid fa-check" id="change-name"></i>
  `;

  //Autoselect the input field value  when user clicks in it.
  let itemNameInput = document.getElementById("item-name-input");
  let fileExtensionInput = document.getElementById("file-extension-input");

  function autoSelect() {
    this.select();
  }
  itemNameInput.addEventListener("click", autoSelect);
  if (fileContent.extension) fileExtensionInput.addEventListener("click", autoSelect);

  let changeName = document.getElementById("change-name");
  changeName.addEventListener("click", () => {
    console.log("ran");
    sendRenameRequest(oldPath, `${itemNameInput.value}.${fileExtensionInput.value}`);
    // if (itemNameInput.value == fileContent.name && fileExtensionInput && fileExtensionInput.value == fileContent.extension) alert("Nothing to Change");
    // else sendRenameRequest(oldPath, `${itemNameInput.value}.${fileExtensionInput.value}`);
  });

  // If user clicks somewhere else on screen
  function handleOutsideClick(event) {
    if (!clickedItem.contains(event.target)) {
      clickedItem.classList.replace("edit-item-name", "item");
      clickedItem.innerHTML = oldHtml;
      document.removeEventListener("click", handleOutsideClick);
    }
  }
  document.addEventListener("click", handleOutsideClick);
}

function sendRenameRequest(oldPath, newName) {
  let url = "http://localhost:3500/rename-file";

  let newPath = oldPath.replace(/((@|\(|\)|\s|\w+)*)?\w+((\s*\w+|-|\.|'|"|\(|\)|@|\{|\})*)?(?!\/)$/, newName);

  let message = {
    oldPath: oldPath,
    newPath: newPath,
  };

  xhttp.open("POST", url, true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(JSON.stringify(message));
}

function previousDir() {
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
  } else {
    previousDirBtn.style.color = "#000";
    previousDirBtn.style.backgroundColor = "#fff";
    previousDirBtn.style.cursor = "pointer";
  }
}

displayFiles(mainFoldersArr);
previousDirBtnState();
