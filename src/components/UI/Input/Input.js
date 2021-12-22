import React from "react";
import "./styles.scss";

const Input = ({ iconLeft, iconRight, children, style, onClick }) => {
  return (
    <div className="input-custom" style={style} onClick={onClick}>
      {iconLeft}
      <span className="input-content">{children}</span>
      {iconRight}
    </div>
  );
};

export default Input;
