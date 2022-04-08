import React from "react";
import { Link } from "react-router-dom";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import "./styles.scss";

function MenuLink() {
  return (
    <div className="menu-link">
      <a href="https://app.efun.tech/" className="link-item" target="_blank" rel="noreferrer">
        Home
      </a>
      <MdOutlineArrowForwardIos className="link-dot" />
      <span className="link-item">Bookie Pool</span>
    </div>
  );
}

export default MenuLink;
