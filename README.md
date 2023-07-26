# canvas_visualization

## Installation

To run the application you will need node installed.

### Frontend

Navigate to the frontend folder.

Run the following command to install dependencies:

npm install

Once the installation is complete, you can start the development server:

npm run dev

Backend
Navigate to the backend/ folder.

Run the following command to install dependencies:

npm install

After installing dependencies, start the backend server:

node index.js

It is going to run on port 5000

Features

1. Entity List Management
   The Entity List Management feature allows users to view, add, edit, and remove entities from a list. Each entity has a name, coordinates, labels.

2. Canvas Visualization
   The Canvas Visualization feature provides a visual representation of the entities in a canvas. Entities are shown as colored shapes, with labels displayed on top. Users can interact with the canvas to view the entities in a graphical format.

3. Editing Entities
   Users can edit the properties of an entity, including its name, coordinates, and labels, using an inline editing feature. When an entity is selected for editing, text fields are displayed, allowing users to modify the entity's properties.

4. Entity Selection
   Users can select entities from the graph and add them to a "Selected Entities" section. The selected entities are displayed in a separate list for easy reference.

5. Functions binded to keyboard
   Users are able to save on pressing "Enter" key and escape editing or adding new entity into the table on pressing "Escape" key.

Technologies Used:
React, Redux, Material-UI, @mui/material, styled-components, Node.js, Express, Canvas API
