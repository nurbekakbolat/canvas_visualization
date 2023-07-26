import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addEntity, removeEntity } from "../store/reducers";
import {
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CanvasVisualization from "./CanvasVisualization";

const Container = styled("div")({
  maxWidth: 700,
  margin: "auto",
  padding: "16px",
});

const StyledListItem = styled(ListItem)(({ color }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "8px",
  backgroundColor: color ? color : "#f5f5f5",
  borderRadius: "4px",
  marginBottom: "8px",
}));

// New styling for the Selected Entities section
const SelectedEntitiesContainer = styled("div")({
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  padding: "8px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  marginTop: "16px",
});

const TableListItem = styled(ListItem)({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gridGap: "8px",
  alignItems: "center",
  padding: "8px",
  borderBottom: "1px solid #ccc",
});
const EntityList = () => {
  const entities = useSelector((state) => state.users.value);
  const dispatch = useDispatch();
  const selectedEntities = useSelector((state) => state.users.selected);

  // State for handling editing
  const [editableId, setEditableId] = useState(null);
  const [editedEntity, setEditedEntity] = useState(null);
  const [newEntity, setNewEntity] = useState({
    name: "",
    coordinate: "",
    labels: "",
  });

  useEffect(() => {
    document.addEventListener("keydown", detectKeyDown);
  }, []);

  const detectKeyDown = (e) => {
    if (e.key === "Escape") {
      setEditableId(null);
    } else if (e.key === "Enter") {
      e.preventDefault(); // Prevent default behavior of the text field (form submission)
      handleSaveClick(e);
    }
    console.log(e.key);
  };

  const handleRemoveEntity = (id) => {
    dispatch(removeEntity({ id }));
  };

  const handleEditClick = (id) => {
    setEditedEntity(entities.find((entity) => entity.id === id));
    setEditableId(id);
  };

  const handleInsertClick = () => {
    setEditableId("new");
  };
  const handleTextFieldKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default behavior of the text field (form submission)
      handleSaveClick(e); // Trigger the save logic
    } else if (e.key === "Escape") {
      setEditableId(null);
    }
  };
  const handleSaveClick = () => {
    if (editableId === "new") {
      // Split the labels input into an array
      const labelsArray = newEntity.labels.split(/[,\s]+/);

      // Create a new entity with the updated labels array
      const newEntityWithLabels = {
        ...newEntity,
        labels: labelsArray,
      };

      dispatch(addEntity(newEntityWithLabels));
    } else {
      // Split the labels input into an array
      let labelsArray;

      const ent = entities.find((entity) => entity.id === editableId);
      console.log(editedEntity);
      if (typeof ent === "undefined") {
        setEditableId(null);
        return;
      }
      if (editedEntity.labels === ent.labels) {
        setEditableId(null);
        return;
      }
      if (editedEntity.labels.length > 1) {
        labelsArray = editedEntity.labels.split(/[,\s]+/);
      } else {
        labelsArray = editedEntity.labels;
      }

      // Create an updated entity with the edited labels array
      const updatedEntity = {
        ...editedEntity,
        labels: labelsArray,
      };

      dispatch(addEntity(updatedEntity));
    }
    setEditableId(null);
    setEditedEntity(null);
    setNewEntity({
      name: "",
      coordinate: "",
      labels: "",
    });
  };

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        List of Entities
      </Typography>
      <List>
        {entities.map((entity) => (
          <StyledListItem key={entity.id}>
            {editableId === entity.id ? (
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    value={editedEntity.name}
                    onChange={(e) =>
                      setEditedEntity({
                        ...editedEntity,
                        name: e.target.value,
                      })
                    }
                    onKeyDown={handleTextFieldKeyDown}
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    fullWidth
                    value={editedEntity.coordinate}
                    onChange={(e) =>
                      setEditedEntity({
                        ...editedEntity,
                        coordinate: e.target.value,
                      })
                    }
                    onKeyDown={handleTextFieldKeyDown}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    value={editedEntity.labels}
                    onChange={(e) =>
                      setEditedEntity({
                        ...editedEntity,
                        labels: e.target.value,
                      })
                    }
                    onKeyDown={handleTextFieldKeyDown}
                  />
                </Grid>
                <Grid item xs={2}>
                  <Button onClick={handleSaveClick}>Save</Button>
                </Grid>
              </Grid>
            ) : (
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={3}>
                  <ListItemText primary={entity.name} />
                </Grid>
                <Grid item xs={2}>
                  <ListItemText primary={entity.coordinate} />
                </Grid>
                <Grid item xs={4}>
                  <ListItemText primary={entity.labels.join(", ")} />
                </Grid>
                <Grid item xs={3}>
                  <Button onClick={() => handleEditClick(entity.id)}>
                    Edit
                  </Button>
                  <Button onClick={() => handleRemoveEntity(entity.id)}>
                    Remove
                  </Button>
                </Grid>
              </Grid>
            )}
          </StyledListItem>
        ))}
        {editableId === "new" && (
          <StyledListItem>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  value={newEntity.name}
                  onChange={(e) =>
                    setNewEntity({ ...newEntity, name: e.target.value })
                  }
                  onKeyDown={handleTextFieldKeyDown}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  value={newEntity.coordinate}
                  onChange={(e) =>
                    setNewEntity({ ...newEntity, coordinate: e.target.value })
                  }
                  onKeyDown={handleTextFieldKeyDown}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  fullWidth
                  value={newEntity.labels}
                  onChange={(e) =>
                    setNewEntity({ ...newEntity, labels: e.target.value })
                  }
                  onKeyDown={handleTextFieldKeyDown}
                />
              </Grid>
              <Grid item xs={2}>
                <Button onClick={handleSaveClick}>Save</Button>
              </Grid>
            </Grid>
          </StyledListItem>
        )}
      </List>
      <Button onClick={handleInsertClick}>Insert Item</Button>
      <CanvasVisualization entities={entities} />
      <div
        style={{
          position: "relative",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <SelectedEntitiesContainer>
            <Typography variant="subtitle1">Selected Entities:</Typography>
            <List>
              {selectedEntities.map((entity, index) => (
                <TableListItem key={entity.id}>
                  <ListItemText primary={entity.name} />
                  <ListItemText secondary={entity.labels.join(", ")} />
                </TableListItem>
              ))}
            </List>
          </SelectedEntitiesContainer>
        </div>
      </div>
    </Container>
  );
};

export default EntityList;
