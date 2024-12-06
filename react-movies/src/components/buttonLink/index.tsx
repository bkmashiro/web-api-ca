import React from "react";
import Chip from "@mui/material/Chip";

interface ChipLinkProps {
  text: string;
  link: string; 
}

const ChipLink: React.FC<ChipLinkProps> = ({ text, link }) => {
  const handleClick = () => {
    window.location.href = link;
  };

  return (
    <Chip
      label={text}
      onClick={handleClick}
      clickable
      style={{
        backgroundColor: "#007BFF",
        color: "#fff",
        fontWeight: "bold",
      }}
    />
  );
};

export default ChipLink;
