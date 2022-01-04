import React, { useEffect } from "react";
import Header from "src/components/Header/Header";
import Footer from "src/components/Footer/Footer";
import MiniGame from "src/components/MiniGame/MiniGame";

const Home = () => {
  useEffect(() => {}, []);

  return (
    <>
      <Header />
      <MiniGame />
      <Footer />
    </>
  );
};

export default Home;
