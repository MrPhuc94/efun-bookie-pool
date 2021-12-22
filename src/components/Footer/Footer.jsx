import React from "react";
import "./styles.scss";

const Footer = () => {
  return (
    <footer className="footer-2">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          <p className="copyright order-md-1 order-2">
            © 2021{" "}
            <a href="#" className="text-primary">
              EFUN.tech
            </a>{" "}
            All rights reserved.
          </p>
          <ul className="order-md-2 order-1">
            <li>
              <a href="#">Terms of Service</a>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
