import React from "react";
import { Link } from "react-router-dom";
import "./style.css";

const Button = (props) => {
  const { link, title } = props;
  return (
    <Link to={link}>
      <button className="btn">{title}</button>
    </Link>
  );
};

export default Button;
