# Glory

### by: Team Minimal Effort

#### A software product of the Spring '25 semester

As more people prioritize their health, the demand for smart fitness solutions is higher than ever. 
Glory offers an e-commerce store where users can shop for fitness gear, apparel and supplements customized to their needs.

## Project Structure

- `backend/`
    - `controllers/`    - business logic between front-end components and the database
    - `db.js`           - connecting to MariaDB
    - `server.js`       - launches server

- `frontend/`
    - folders for each webpage
        - `index.html`  - defines UI components
        - `script.js`   - logic behind front-end components
        - `style.css`   - UI styling

- `test/`
    - test case implementation, system testing
    - each `.js` tests a test case in the test design specification
    
- `images_fonts/`
        - `.png` files used in the front-end

- `node_modules/`
        - dependencies for Node.js


## How to run:

#### Prerequisites: 
    - Access to the CS431 VM
    - Clone of this repository in the VM
    - Configured MariaDB in the VM
    - Node.js installed with appropriate dependencies

In the root project directory, run `node backend/server.js`

