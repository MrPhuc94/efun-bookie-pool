import React from "react";
import Spinner from "../UI/Spinner/Spinner";
import "./styles.scss";

function AppLoading() {
  return (
    <div className="app-loading">
      <Spinner />
    </div>
  );
}

export default AppLoading;
