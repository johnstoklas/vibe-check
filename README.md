# Vibe Check Documentation

This is the documentation for Vibe Check. We used model-view-controller for our architecture, which can be seen in our component diagram and 
our documentation, which can be seen by visiting `/docs/index.html`.

- [Requirements Specifications](https://docs.google.com/document/d/19uKTRGivM5we35rBtd4GNDOvkSwqAgvlWUhv_v7JPTE/edit?usp=sharing)
- [Documentation for Users, Guests, and Admin](https://docs.google.com/document/d/1sUqYl_87Sc1SEAdALiNG2b282veidoEDE_HjJwiv9ZA/edit?usp=sharing)

## Overview

- Frontend: EJS views
- Backend: Node.js, Express, MySQL
- Major Dependencies (we recommend understanding these dependencies well to understand the project): 
    - Expression Sessions: to keep track of if a user is logged in
    - Web Sockets: to send messages during game play
    - Jest: for unit testing

## Install Instructions

1. **Clone the Repository**:
   Clone this repository to your local machine using the following command:
   ```git clone https://github.com/johnstoklas/vibe-check```

2. **Download my SQL**
    - You will need MySQL to store user and game data for Vibe Check.
    - Follow these steps:
        - Download MySQL Installer from the official MySQL website.
        - Install MySQL Server (make sure to select MySQL Server during setup).
        - During installation, set a root password that you will remember — you will use it to connect the app.
        - Install MySQL Workbench for a graphical interface to manage your database easily.
    - Once MySQL is opened, copy and paste the SQL file located in `/sql_files` and open a new query in local instance.
    - Refresh the table and the vibecheck database should now be there.

3. **Create a `.env` File**:
   In the root directory of your project, create a new file named `.env`.
   Add the following environment variables to the `.env` file:
   ```
    DB_HOST = 127.0.0.1
    DB_USER = root
    DB_PASSWORD = add your root password here
    DB_NAME = vibecheck
   ```

4. **Install npm Dependencies**:
   Ensure you have Node.js and npm installed. You can download them from Node.js.
   Open a terminal and navigate to your project directory and run:
   ```npm install```
   Once the installation is complete, you’ll see a node_modules folder in your project directory, which contains all the installed packages.
   Then run:
   ```npm start```

## Key Sections
- `__tests__` handles all of the tests for controllers
- `.github/workflows` stores script for testing that is run when code is pushed into main
- `/architecture` handles models, controllers, and routers (you can see a more expanded view of these on the docs website)
    - `/controllers` holds all of our controllers
    - `/models` holds all of our models
    - `/routes` holds all of our routers
    - `database.js` handles database connectivity
    - `utility.js` handles client-side alerts
- `/public` holds all of our assets and documentation
    - `/docs` holds all of our documentation
    - `/fonts` holds custom fonts (in our case PressStart2P is used for most of the website)
    - `/images` holds all of our images for backgrounds, characters, and any other assets
        - `/character_images` holds all of our character images
        - `/stylesheets` holds styles that goes across all pages like font (most of the styling for each page is stored in the actual ejs file itself)
- `/sql_files` contains SQL dump for MySQL setup
- `/views` holds ejs pages and partials
    - `/pages` holds all of our main pages (script, style, and body are all stored in one file per page)
    - `/partials` holds all of our partials
- `app.js` handles routing logic and setup for the website
- `jsdoc.json` documentation setup file
- `package-lock.json` dependencies file
- `package.json` dependencies file

## Documentation Note

If you changed a file or function and you need to update the documentation, you can update it using JSDocs and then run `npm run docs`. Next time you run `npm start` and navigate to the docs page, the updates will be there

