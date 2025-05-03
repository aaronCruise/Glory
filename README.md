# Glory

### by: Team Minimal Effort

#### A software product of the Spring '25 semester

As more people prioritize their health, the demand for smart fitness solutions is higher than ever. 
Glory offers an e-commerce store where users can shop for fitness gear, apparel and supplements customized to their needs.

## Project Structure

- `backend/`
    - `controllers/`    - business logic between front-end components and the database
    - `db.js`           - connecting to MariaDB
    - `server.js`       - server launcher
    - `products.json`   - products repository

- `frontend/`
    - view-specific folders for each webpage
        - `index.html`  - defines UI components
        - `script.js`   - logic behind front-end components
        - `style.css`   - UI styling
    - `shared_elements` - common header/footer styles

- `tests/`
    - test case implementation; automated system testing
    - each `.js` tests a case in the test design specification
    
- `images_fonts/`
        - `.png` files used in the front-end

- `node_modules/`
        - external dependencies for Node.js
