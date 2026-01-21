import React from "react";
import SingleComment from "./SingleComments";

const Card = ({ comment, onDelete }) => {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "10px",
        margin: "0.7rem",
        borderRadius: "6px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* left side: comment */}
      <SingleComment comment={comment} />   
    </div>
  );
};

export default Card;
