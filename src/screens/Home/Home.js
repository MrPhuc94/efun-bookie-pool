import React, { useEffect } from "react";
import Header from "src/components/Header/Header";
import Footer from "src/components/Footer/Footer";
import MiniGame from "src/components/MiniGame/MiniGame";
import { store } from "src/redux/store";
import { changeSeasonList } from "src/redux/reducers/matchesSlice";
import axios from "axios";

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
