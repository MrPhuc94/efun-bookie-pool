import React, { useEffect } from "react";
import Header from "src/components/Header/Header";
import Footer from "src/components/Footer/Footer";
import BookiePool from "src/components/BookiePool/BookiePool";

const Home = () => {
  useEffect(() => {}, []);

  return (
    <>
      <Header />
      <div className="container">
        <BookiePool />
      </div>
      <Footer />
    </>
  );
};

export default Home;
