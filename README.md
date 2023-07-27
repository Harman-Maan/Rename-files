# Rename-files

## Introduction
Hey there! So, I am creating this cool project because I always need to download a ton of files—images, songs, documents—you name it, then I need to rename them. It is a real pain-- open file to check it's contents, right-click, select rename, rename, repeat, and it goes on. It's manageable when you have just a handful of files, but trust me, when you've got around 50 to 100 of them, it's a total drag.

Now, I'm not gonna lie, the project is only halfway done at the moment. But hey, I'm working on it, and it's already pretty handy. And guess what? If you wanna contribute to this open-source masterpiece, I'd be thrilled! Together, we might just build something super awesome.

## Installation

First things first, you'll need to have Node.js installed on your computer. Once you've got that sorted, follow these steps:

1. "cd" into the directory where you want the repository to be cloned.
2. Clone the repo by running this command in your terminal:
  ```bash
  git clone https://github.com/Harman-Maan/Rename-files.git
  ```

## Deployment
1. Open your terminal and navigate to the project directory.
2. Run the following command:
  ```npm
  npm start
  ```
3. Keep an eye out for the message "Server running on port 3500." That means the server is up and ready!
4. Finally, open your web browser and go to "http://localhost:3500". Voilà! You're now ready to use "Rename-files."

## APIs and Dependencies
This baby is still growing, and right now, it's got only one installed dependency—"express." We also use font-awesome icons via CDN, because why not? In the future, I might add more dependencies, but for now, it's all we need.

## File Structure
Just a sneak peek into the project's file structure:

1. `index.js`: The server file where the magic happens.
2. `views/index.html`: The page that greets you when you hit "http://localhost:3500".
3. `public/`: The power zone! Contains `css/`, `js/`, and `image/` folders.
4. `public/css/`: Here we have `icons.css` that specifies colors for our icons, and `styles.css` with the rest of the styles.
5. `public/js/`: Check out `icons.js` exporting classes for font-awesome icons. `index.js` has all the functionality of the site, don't worry, I do plan to create separate files for large function as the project increases in size.
6. `public/images/`: Not doing much right now, but there's a cool image waiting for its moment.
7. Other files in the directory are `.gitignore`, `package.json`, and `package-lock.json`. The usual suspects.

And that's it! We've got a bit of work left, but hey, it's already shaping up nicely. Feel free to jump in and make this project shine. Let's create something amazing together! 🚀
