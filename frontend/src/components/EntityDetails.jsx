import React, { useState } from "react";
import { connect } from "react-redux";
import { editEntity } from "../store/actions";

const EntityDetails = ({ entity, editEntity }) => {
  const [name, setName] = useState(entity.name);
  const [coordinate, setCoordinate] = useState(entity.coordinate);
  const [labels, setLabels] = useState(entity.labels.join(", "));

  const handleSubmit = (e) => {
    e.preventDefault();
    editEntity(entity.id, {
      name,
      coordinate,
      labels: labels.split(",").map((label) => label.trim()),
    });
  };

  return (
    <div>
      <h2>Entity Details</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>Coordinate:</label>
          <input
            type="text"
            value={coordinate}
            onChange={(e) => setCoordinate(e.target.value)}
          />
        </div>
        <div>
          <label>Labels:</label>
          <input
            type="text"
            value={labels}
            onChange={(e) => setLabels(e.target.value)}
          />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

const mapDispatchToProps = {
  editEntity,
};

export default connect(null, mapDispatchToProps)(EntityDetails);
