import { createSlice } from "@reduxjs/toolkit";
import { userData } from "../../../api/db.json";
import axios from "axios";

const entitiesSlice = createSlice({
  name: "users",
  initialState: { value: userData, selected: [] },
  reducers: {
    addEntity(state, action) {
      const updatedEntity = action.payload;
      console.log(updatedEntity);
      const entityIndex = state.value.findIndex(
        (entity) => entity.id === updatedEntity.id
      );

      if (entityIndex !== -1) {
        // If the entity already exists in the state, update it
        state.value[entityIndex] = updatedEntity;
        axios
          .put(
            `http://localhost:5000/entities/${updatedEntity.id}`,
            updatedEntity
          )
          .then((response) => {
            console.log("Updated Entity:", response.data);
          })
          .catch((error) => {
            // Handle errors
            console.error("Error updating entity:", error);
          });
      } else {
        // If the entity is not found in the state, add it
        state.value.push(updatedEntity);
        axios
          .post(`http://localhost:5000/entities`, updatedEntity)
          .then((response) => {
            console.log("Added Entity:", response.data);
          })
          .catch((error) => {
            // Handle errors
            console.error("Error adding entity:", error);
          });
      }
    },
    removeEntity(state, action) {
      const entityId = action.payload.id; // Access the id property from the payload
      const entityIndex = state.value.findIndex(
        (entity) => entity.id === entityId
      );
      if (entityIndex !== -1) {
        axios
          .delete(`http://localhost:5000/entities/${entityId}`)
          .then((response) => {
            console.log("Removed Entity:", response.data);
          })
          .catch((error) => {
            // Handle errors
            console.error("Error removing entity:", error);
          });
        state.value.splice(entityIndex, 1); // Remove the entity from the state
      }
    },
    addSelectedEntities(state, action) {
      console.log(action.payload);
      const selectedEntities = action.payload;
      state.selected = selectedEntities;
    },
  },
});

export const { addEntity, removeEntity, addSelectedEntities } =
  entitiesSlice.actions;
export default entitiesSlice.reducer;
