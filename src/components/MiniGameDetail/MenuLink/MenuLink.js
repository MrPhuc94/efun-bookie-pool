import React from "react";
import { Link } from "react-router-dom";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import "./styles.scss";

function MenuLink() {
  return (
    <div className="menu-link">
      <Link to="/" className="link-item">
        Home
      </Link>
      <MdOutlineArrowForwardIos className="link-dot" />
      <span className="link-item">Bookie Pool</span>
    </div>
  );
}

export default MenuLink;
