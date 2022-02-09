import Footer from "src/components/Footer/Footer";
import Header from "src/components/Header/Header";
import React from "react";
import "./styles.scss";
import Images from "src/common/Images";
import { Link } from "react-router-dom";
import { WIDTH } from "src/assets/themes/dimension";

function NotFound() {
  return (
    <>
      <Header />
      <div className="container">
        <div className="not-found">
          <img
            src={Images.NotFound}
            alt="NotFound"
            width={`${WIDTH > 600 ? "30%" : "60%"}`}
          />
          <Link to="/">
            <h4>Home Page</h4>
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default NotFound;
