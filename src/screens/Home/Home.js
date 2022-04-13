import React, { useEffect } from "react";
import Header from "src/components/Header/Header";
import Footer from "src/components/Footer/Footer";
import BookiePool from "src/components/BookiePool/BookiePool";
import { useSelector } from "react-redux";

const Home = () => {
  useEffect(() => {}, []);
  const appPopUps = useSelector((state) => state.app.appPopUps || []);


  return (
    <div className={`${appPopUps[0] && 'body-page'}`}>
      <Header />
      <div className="container">
        <BookiePool />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
