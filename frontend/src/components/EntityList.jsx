import React, { useState } from "react";
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

const EntityList = () => {
  const entities = useSelector((state) => state.users.value);
  const dispatch = useDispatch();

  // State for handling editing
  const [editableId, setEditableId] = useState(null);
  const [editedEntity, setEditedEntity] = useState(null);
  const [newEntity, setNewEntity] = useState({
    name: "",
    coordinate: "",
    labels: "",
  });

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

  const handleSaveClick = () => {
    if (editableId === "new") {
      // Split the labels input into an array
      const labelsArray = newEntity.labels.split(/[,\s]+/);

      // Create a new entity with the updated labels array
      const newEntityWithLabels = {
        ...newEntity,
        labels: labelsArray,
        color: getRandomColor(), // Generate a random color for the new entity
      };

      dispatch(addEntity(newEntityWithLabels));
    } else {
      // Split the labels input into an array
      const labelsArray = editedEntity.labels.split(/[,\s]+/);

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

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        List of Entities
      </Typography>
      <List>
        {entities.map((entity) => (
          <StyledListItem key={entity.id} color={entity.color}>
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
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  value={newEntity.coordinate}
                  onChange={(e) =>
                    setNewEntity({ ...newEntity, coordinate: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  fullWidth
                  value={newEntity.labels}
                  onChange={(e) =>
                    setNewEntity({ ...newEntity, labels: e.target.value })
                  }
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
    </Container>
  );
};

export default EntityList;
