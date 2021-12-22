import React from "react";
import Loader from "react-loader-spinner";

const Spinner = () => {
  return (
    <Loader
      type="ThreeDots"
      color="#00BFFF"
      height={60}
      width={60}
      style={{
        height: "100vh",
        justifyContent: "center",
        display: "flex",
        alignItems: "center",
      }}
    />
  );
};

export default Spinner;
