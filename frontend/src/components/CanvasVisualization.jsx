import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addSelectedEntities } from "../store/reducers";
import { List, ListItem, ListItemText, Typography } from "@mui/material";
const CanvasVisualization = ({ entities }) => {
  const canvasRef = useRef(null);
  const dispatch = useDispatch();
  const [canvasContext, setCanvasContext] = useState(null);
  const [selectionStart, setSelectionStart] = useState(null);
  const [selectionEnd, setSelectionEnd] = useState(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [selectedEntities, setSelectedEntities] = useState([]);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    setCanvasContext(ctx);
  }, []);

  useEffect(() => {
    if (canvasContext) {
      // Clear the canvas before drawing
      canvasContext.clearRect(
        0,
        0,
        canvasContext.canvas.width,
        canvasContext.canvas.height
      );

      // Draw the entities on the canvas
      entities.forEach((entity) => {
        drawEntity(entity);
      });
      drawAxes();

      // Draw selection rectangle if selection is being made
      if (selectionStart && selectionEnd && isMouseDown) {
        // Only draw when mouse is pressed
        drawSelectionRect();
      }
    }
  }, [canvasContext, entities, selectionStart, selectionEnd, isMouseDown]);

  const drawEntity = (entity) => {
    const { id, name, coordinate, labels } = entity;

    // Split the coordinate string into x and y coordinates
    const [xStr, yStr] = coordinate.split(",");
    const x = parseFloat(xStr.trim());
    const y = parseFloat(yStr.trim());

    // Scale the x and y coordinates to fit the visible canvas area
    const scale = 20; // You can adjust this value to fit your data
    const scaledX = x * scale + canvasContext.canvas.width / 2;
    const scaledY = -y * scale + canvasContext.canvas.height / 2;

    // Define circle properties
    const radius = 10; // Reduced the radius to make the circles more visible
    const color = "steelblue"; // User-friendly color for the circle

    // Draw the circle
    canvasContext.beginPath();
    canvasContext.arc(scaledX, scaledY, radius, 0, 2 * Math.PI);
    canvasContext.fillStyle = color;
    canvasContext.fill();
    canvasContext.closePath();

    // Draw the label
    canvasContext.fillStyle = "black";
    canvasContext.font = "12px Arial";
    canvasContext.fillText(name, scaledX - radius, scaledY + 5);

    // Draw the labels
    canvasContext.fillStyle = "black";
    canvasContext.font = "10px Arial";
    const labelsString = labels.join(", ");
    canvasContext.fillText(labelsString, scaledX - radius, scaledY + 20);
  };

  const drawAxes = () => {
    // Draw x-axis
    canvasContext.beginPath();
    canvasContext.moveTo(0, canvasContext.canvas.height / 2);
    canvasContext.lineTo(
      canvasContext.canvas.width,
      canvasContext.canvas.height / 2
    );
    canvasContext.strokeStyle = "black";
    canvasContext.stroke();
    canvasContext.closePath();

    // Draw y-axis
    canvasContext.beginPath();
    canvasContext.moveTo(canvasContext.canvas.width / 2, 0);
    canvasContext.lineTo(
      canvasContext.canvas.width / 2,
      canvasContext.canvas.height
    );
    canvasContext.strokeStyle = "black";
    canvasContext.stroke();
    canvasContext.closePath();
  };

  const handleMouseDown = (e) => {
    setIsMouseDown(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    setSelectionStart({ x, y });
    setSelectionEnd(null);

    // Add event listener for mousemove during selection
    canvas.addEventListener("mousemove", handleMouseMove);
  };

  const handleMouseUp = (e) => {
    setIsMouseDown(false);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    setSelectionEnd({ x, y });

    // Remove event listener for mousemove after selection
    canvas.removeEventListener("mousemove", handleMouseMove);

    performQuery();
  };

  const drawSelectionRect = () => {
    const minX = Math.min(selectionStart.x, selectionEnd.x);
    const maxX = Math.max(selectionStart.x, selectionEnd.x);
    const minY = Math.min(selectionStart.y, selectionEnd.y);
    const maxY = Math.max(selectionStart.y, selectionEnd.y);

    const width = maxX - minX;
    const height = maxY - minY;

    canvasContext.strokeStyle = "red"; // User-friendly color for the selection rectangle
    canvasContext.strokeRect(minX, minY, width, height);
  };

  const performQuery = () => {
    if (!selectionStart || !selectionEnd) return;

    // Scale the selection coordinates back to the original scale
    const scale = 20; // The same scale used in drawEntity function
    const originalStartX =
      (selectionStart.x - canvasContext.canvas.width / 2) / scale;
    const originalStartY =
      -(selectionStart.y - canvasContext.canvas.height / 2) / scale;
    const originalEndX =
      (selectionEnd.x - canvasContext.canvas.width / 2) / scale;
    const originalEndY =
      -(selectionEnd.y - canvasContext.canvas.height / 2) / scale;

    // Find entities within the selected rectangle
    const selectedEntities = entities.filter((entity) => {
      const { coordinate } = entity;
      const [xStr, yStr] = coordinate.split(",");
      const entityX = parseFloat(xStr.trim());
      const entityY = parseFloat(yStr.trim());

      const minX = Math.min(originalStartX, originalEndX);
      const maxX = Math.max(originalStartX, originalEndX);
      const minY = Math.min(originalStartY, originalEndY);
      const maxY = Math.max(originalStartY, originalEndY);

      return (
        entityX >= minX && entityX <= maxX && entityY >= minY && entityY <= maxY
      );
    });

    const selectedLabels = selectedEntities
      .map((entity) => entity.labels)
      .flat();

    console.log("Selected entities:", selectedEntities);
    console.log("Selected labels:", selectedLabels);
    setSelectedEntities(selectedEntities);
    dispatch(addSelectedEntities(selectedEntities));
  };

  const handleMouseMove = (e) => {
    // Force a re-render to update the selection rectangle
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    setSelectionEnd({ x, y });
  };

  return (
    <div style={{ position: "relative" }}>
      <canvas
        ref={canvasRef}
        width={800} // Set the canvas width
        height={600} // Set the canvas height
        style={{ border: "1px solid black" }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
};

export default CanvasVisualization;
